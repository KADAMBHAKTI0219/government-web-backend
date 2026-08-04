import { body } from 'express-validator';

export const cmsValidator = [
  body('key').trim().notEmpty().withMessage('CMS section key is required'),
  body('content').notEmpty().withMessage('CMS content payload is required')
];
