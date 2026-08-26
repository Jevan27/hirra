import express from 'express';
import { query, param } from 'express-validator';
import { getJobs, getFeaturedJobs, getJobById, searchJobs } from '../controllers/jobController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { searchRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /api/jobs/featured
router.get('/featured', getFeaturedJobs);

// GET /api/jobs/search?q=frontend&location=Manila
router.get(
  '/search',
  searchRateLimiter,
  [
    query('q').optional().isString().trim().isLength({ max: 200 }).withMessage('Search query too long'),
    query('location').optional().isString().trim().isLength({ max: 200 }).withMessage('Location query too long'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    validateRequest
  ],
  searchJobs
);

// GET /api/jobs
router.get(
  '/',
  searchRateLimiter,
  [
    query('q').optional().isString().trim().isLength({ max: 200 }).withMessage('Search query too long'),
    query('location').optional().isString().trim().isLength({ max: 200 }).withMessage('Location query too long'),
    query('employmentType').optional(),
    query('workArrangement').optional(),
    query('category').optional(),
    query('experienceLevel').optional(),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
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
