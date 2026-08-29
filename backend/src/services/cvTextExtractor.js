import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Clean and normalize extracted document text for AI processing.
 * Preserves structure, line breaks, section headers, and bullet points.
 * @param {string} rawText
 * @returns {string}
 */
const cleanDocumentText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  return rawText
    // Remove control characters (except newline, tab, carriage return)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize unicode spaces
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Reduce excessive multiple empty lines to max 2
    .replace(/\n{3,}/g, '\n\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
};

class CvTextExtractor {
  /**
   * Extract readable text from an uploaded CV buffer.
   * @param {Buffer} buffer - In-memory file buffer
   * @param {string} mimeType - File MIME type
   * @param {string} originalName - Original filename with extension
   * @returns {Promise<{ text: string, hasText: boolean, charCount: number }>}
   */
  async extractText(buffer, mimeType, originalName = '') {
    if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
      return { text: '', hasText: false, charCount: 0 };
    }

    const filename = originalName.toLowerCase();
    let rawText = '';

    try {
      if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
        const pdfData = await pdfParse(buffer);
        rawText = pdfData.text || '';
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimeType === 'application/msword' ||
        filename.endsWith('.docx') ||
        filename.endsWith('.doc')
      ) {
        const docResult = await mammoth.extractRawText({ buffer });
        rawText = docResult.value || '';
      } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
        rawText = buffer.toString('utf-8');
      } else {
        // Attempt PDF fallback, then mammoth fallback
        try {
          const pdfFallback = await pdfParse(buffer);
          rawText = pdfFallback.text || '';
        } catch {
          const docFallback = await mammoth.extractRawText({ buffer });
          rawText = docFallback.value || '';
        }
      }
    } catch (parseError) {
      console.warn('[CvTextExtractor] Parser warning/error:', parseError.message);
      return { text: '', hasText: false, charCount: 0 };
    }

    const cleanedText = cleanDocumentText(rawText);
    const hasText = cleanedText.length >= 30; // Meaningful text threshold

    return {
      text: cleanedText,
      hasText,
      charCount: cleanedText.length
    };
  }
}

export const cvTextExtractor = new CvTextExtractor();
