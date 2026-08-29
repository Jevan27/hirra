import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand, 
  HeadObjectCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Sanitize filename for safe R2 object key path
 * E.g. "John Doe — Resume (Final).pdf" -> "john-doe-resume-final.pdf"
 * @param {string} originalName
 * @returns {string}
 */
export const sanitizeFilename = (originalName = 'resume.pdf') => {
  const parts = originalName.split('.');
  const ext = parts.length > 1 ? `.${parts.pop().toLowerCase()}` : '';
  const base = parts.join('.');

  const cleanBase = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return `${cleanBase || 'resume'}${ext}`;
};

class R2StorageService {
  constructor() {
    this.s3Client = null;
  }

  /**
   * Check if R2 storage credentials are fully configured in the environment
   * @returns {boolean}
   */
  isConfigured() {
    const hasCredentials = Boolean(
      process.env.R2_ACCESS_KEY_ID && 
      process.env.R2_SECRET_ACCESS_KEY
    );
    const hasEndpoint = Boolean(
      process.env.R2_ENDPOINT || 
      process.env.R2_ACCOUNT_ID
    );
    return hasCredentials && hasEndpoint;
  }

  /**
   * Get the target R2 bucket name (default: 'hirra')
   * @returns {string}
   */
  getBucketName() {
    return process.env.R2_BUCKET_NAME || 'hirra';
  }

  /**
   * Lazy-initialize and return the S3 client for Cloudflare R2
   * @returns {S3Client}
   */
  getS3Client() {
    if (!this.isConfigured()) {
      const error = new Error('Cloudflare R2 storage credentials are not configured in backend/.env');
      error.statusCode = 503;
      error.code = 'R2_CONFIG_MISSING';
      throw error;
    }

    if (!this.s3Client) {
      const endpoint = process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        },
      });
    }

    return this.s3Client;
  }

  /**
   * Build predictable, isolated logical object key for candidate resumes
   * Pattern: candidates/{userId}/resumes/{resumeId}/original/{safeFilename}
   * @param {string} userId - Authenticated user UUID
   * @param {string} resumeId - Resume database UUID
   * @param {string} originalName - Original uploaded filename
   * @returns {string}
   */
  buildResumeKey(userId, resumeId, originalName) {
    const safeFilename = sanitizeFilename(originalName);
    return `candidates/${userId}/resumes/${resumeId}/original/${safeFilename}`;
  }

  /**
   * Upload candidate CV buffer to Cloudflare R2
   * @param {Object} params
   * @param {Buffer} params.buffer - In-memory file buffer
   * @param {string} params.mimeType - File MIME type
   * @param {string} params.originalName - Original file name
   * @param {string} params.userId - Candidate User UID
   * @param {string} params.resumeId - Unique Resume UUID
   * @returns {Promise<{ objectKey: string, bucket: string, size: number, mimeType: string, originalName: string }>}
   */
  async uploadResume({ buffer, mimeType, originalName, userId, resumeId }) {
    const client = this.getS3Client();
    const bucket = this.getBucketName();
    const objectKey = this.buildResumeKey(userId, resumeId, originalName);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        userid: String(userId),
        resumeid: String(resumeId),
        originalname: encodeURIComponent(originalName || 'resume.pdf')
      }
    });

    try {
      await client.send(command);
      return {
        objectKey,
        bucket,
        size: buffer.length,
        mimeType,
        originalName
      };
    } catch (err) {
      console.error('[R2StorageService] PutObject failed:', err.message);
      const error = new Error('Failed to upload CV to Cloudflare R2 cloud storage');
      error.statusCode = 502;
      error.code = 'R2_UPLOAD_FAILED';
      error.details = err.message;
      throw error;
    }
  }

  /**
   * Generate short-lived presigned download URL for authorized candidate CV access
   * @param {string} objectKey - R2 object key
   * @param {number} expiresInSeconds - Expiration in seconds (default: 300)
   * @returns {Promise<string>} Temporary presigned URL
   */
  async generatePresignedDownloadUrl(objectKey, expiresInSeconds = 300) {
    const client = this.getS3Client();
    const bucket = this.getBucketName();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey
    });

    try {
      const presignedUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
      return presignedUrl;
    } catch (err) {
      console.error('[R2StorageService] getSignedUrl failed:', err.message);
      const error = new Error('Failed to generate presigned download URL for resume');
      error.statusCode = 500;
      error.code = 'PRESIGNED_URL_FAILED';
      throw error;
    }
  }

  /**
   * Download resume object from R2 as Buffer (used for retry text extraction)
   * @param {string} objectKey
   * @returns {Promise<{ buffer: Buffer, mimeType: string, size: number }>}
   */
  async getResumeBuffer(objectKey) {
    const client = this.getS3Client();
    const bucket = this.getBucketName();

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey
    });

    try {
      const response = await client.send(command);
      const streamToBuffer = async (stream) => {
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      };

      const buffer = await streamToBuffer(response.Body);
      return {
        buffer,
        mimeType: response.ContentType || 'application/pdf',
        size: response.ContentLength || buffer.length
      };
    } catch (err) {
      console.error('[R2StorageService] GetObject failed:', err.message);
      const error = new Error('Failed to retrieve resume file from Cloudflare R2 storage');
      error.statusCode = 502;
      error.code = 'R2_DOWNLOAD_FAILED';
      throw error;
    }
  }

  /**
   * Delete resume object from R2 (e.g. on resume removal or cleanup)
   * @param {string} objectKey
   * @returns {Promise<boolean>}
   */
  async deleteResume(objectKey) {
    if (!objectKey) return false;
    const client = this.getS3Client();
    const bucket = this.getBucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: objectKey
    });

    try {
      await client.send(command);
      return true;
    } catch (err) {
      console.warn('[R2StorageService] DeleteObject warning:', err.message);
      return false;
    }
  }

  /**
   * Check if object exists in R2
   * @param {string} objectKey
   * @returns {Promise<boolean>}
   */
  async objectExists(objectKey) {
    if (!objectKey) return false;
    const client = this.getS3Client();
    const bucket = this.getBucketName();

    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: objectKey
    });

    try {
      await client.send(command);
      return true;
    } catch {
      return false;
    }
  }
}

export const r2StorageService = new R2StorageService();
