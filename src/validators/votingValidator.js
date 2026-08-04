import { body } from 'express-validator';

export const voteValidator = [
  body('applicationId').isMongoId().withMessage('Valid Application ID is required'),
  body('fingerprint').notEmpty().withMessage('Device fingerprint is required for vote validation'),
  body('voterEmail').optional().isEmail().withMessage('Valid voter email address required')
];
