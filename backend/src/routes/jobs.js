import express from 'express';
import { query, param } from 'express-validator';
import { getJobs, getFeaturedJobs, getJobById, searchJobs } from '../controllers/jobController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// GET /api/jobs/featured
router.get('/featured', getFeaturedJobs);

// GET /api/jobs/search?q=frontend&location=Manila
router.get(
  '/search',
  [
    query('q').optional().isString().trim(),
    query('location').optional().isString().trim(),
    validateRequest
  ],
  searchJobs
);

// GET /api/jobs
router.get(
  '/',
  [
    query('q').optional().isString().trim(),
    query('location').optional().isString().trim(),
    query('employmentType').optional(),
    query('workArrangement').optional(),
    query('category').optional(),
    query('experienceLevel').optional(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validateRequest
  ],
  getJobs
);

// GET /api/jobs/:id
router.get(
  '/:id',
  [
    param('id').isString().trim().notEmpty(),
    validateRequest
  ],
  getJobById
);

export default router;
