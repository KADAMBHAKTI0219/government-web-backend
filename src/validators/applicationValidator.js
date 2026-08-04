import { body } from 'express-validator';

export const createApplicationValidator = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('title').trim().notEmpty().withMessage('Application title is required'),
  body('workSummary').trim().notEmpty().withMessage('Work summary is required'),
  body('contentUrl').trim().notEmpty().withMessage('Valid content link/URL is required'),
  body('district').trim().notEmpty().withMessage('District is required')
];

export const updateApplicationStatusValidator = [
  body('status')
    .isIn(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'APPROVED', 'REJECTED', 'WINNER'])
    .withMessage('Invalid application status'),
  body('remarks').optional().trim()
];
