import { body } from 'express-validator';

export const newsValidator = [
  body('title').trim().notEmpty().withMessage('News title is required'),
  body('summary').trim().notEmpty().withMessage('News summary is required'),
  body('content').trim().notEmpty().withMessage('News content body is required'),
  body('status').optional().isIn(['DRAFT', 'PUBLISHED', 'SCHEDULED'])
];
