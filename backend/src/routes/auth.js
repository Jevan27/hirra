import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login, getMe, refresh, logout } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific rate limiter for authentication routes (defense against brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 auth attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: 'RATE_LIMITED',
      message: 'Too many authentication attempts. Please try again later.'
    });
  }
});

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
    body('password').isLength({ min: 6, max: 100 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').optional().isString().trim().isLength({ max: 50 }).withMessage('First name too long'),
    body('middleName').optional().isString().trim().isLength({ max: 50 }).withMessage('Middle name too long'),
    body('lastName').optional().isString().trim().isLength({ max: 50 }).withMessage('Last name too long'),
    body('role').optional().isIn(['CANDIDATE', 'JOB_SEEKER', 'EMPLOYER', 'ADMIN']).withMessage('Role must be CANDIDATE, EMPLOYER, or ADMIN'),
    validateRequest
  ],
  register
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    validateRequest
  ],
  login
);

// GET /api/auth/me (Protected: returns authenticated user identity + PostgreSQL profile)
router.get('/me', requireAuth, getMe);

// POST /api/auth/refresh
router.post(
  '/refresh',
  [
    body('refreshToken').isString().notEmpty().withMessage('Refresh token is required'),
    validateRequest
  ],
  refresh
);

// POST /api/auth/logout
router.post('/logout', logout);

export default router;
