import { body } from 'express-validator';

export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message content is required'),
  body('type').optional().isIn(['GENERAL', 'FEEDBACK', 'SUPPORT', 'GRIEVANCE'])
];
