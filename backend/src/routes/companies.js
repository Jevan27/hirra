import express from 'express';
import { param } from 'express-validator';
import { getCompanies, getCompanyById } from '../controllers/companyController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// GET /api/companies
router.get('/', getCompanies);

// GET /api/companies/:id
router.get(
  '/:id',
  [
    param('id').isString().trim().notEmpty(),
    validateRequest
  ],
  getCompanyById
);

export default router;
