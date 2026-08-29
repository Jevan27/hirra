import express from 'express';
import multer from 'multer';
import { 
  extractCv, 
  downloadResume, 
  retryExtraction, 
  getResumes, 
  deleteResume, 
  getProfile, 
  updateProfile,
  deleteAccount
} from '../controllers/candidateController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory multipart upload handling (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];

    const filename = file.originalname.toLowerCase();
    const isAllowedExt =
      filename.endsWith('.pdf') ||
      filename.endsWith('.docx') ||
      filename.endsWith('.doc') ||
      filename.endsWith('.txt');

    if (allowedMimeTypes.includes(file.mimetype) || isAllowedExt) {
      cb(null, true);
    } else {
      const error = new Error('Unsupported file format. Please upload a PDF, DOCX, DOC, or TXT file.');
      error.statusCode = 400;
      error.code = 'INVALID_FILE_TYPE';
      cb(error, false);
    }
  },
});

// All candidate onboarding & resume routes require authenticated CANDIDATE role
router.use(requireAuth);
router.use(requireRole('CANDIDATE'));

// CV Upload & Extraction
router.post('/extract-cv', upload.single('file'), extractCv);

// Resumes Management
router.get('/resumes', getResumes);
router.get('/resumes/:id/download', downloadResume);
router.post('/resumes/:id/retry-extract', retryExtraction);
router.delete('/resumes/:id', deleteResume);

// Candidate Profile Management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Account Deletion
router.delete('/account', deleteAccount);

export default router;
