import express from 'express';
import { param } from 'express-validator';
import { getCategories, getCategoryById } from '../controllers/categoryController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// GET /api/categories
router.get('/', getCategories);

// GET /api/categories/:id
router.get(
  '/:id',
  [
    param('id').isString().trim().notEmpty(),
    validateRequest
  ],
  getCategoryById
);

export default router;
