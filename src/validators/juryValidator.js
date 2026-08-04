import { body } from 'express-validator';

export const assignJuryValidator = [
  body('juryId').isMongoId().withMessage('Valid Jury User ID is required'),
  body('applicationId').isMongoId().withMessage('Valid Application ID is required')
];

export const scoreApplicationValidator = [
  body('scores.creativity')
    .isInt({ min: 0, max: 25 })
    .withMessage('Creativity score must be between 0 and 25'),
  body('scores.socialImpact')
    .isInt({ min: 0, max: 25 })
    .withMessage('Social impact score must be between 0 and 25'),
  body('scores.technicalQuality')
    .isInt({ min: 0, max: 25 })
    .withMessage('Technical quality score must be between 0 and 25'),
  body('scores.culturalRelevance')
    .isInt({ min: 0, max: 25 })
    .withMessage('Cultural relevance score must be between 0 and 25'),
  body('recommendation')
    .isIn(['APPROVE', 'REJECT', 'SHORTLIST'])
    .withMessage('Valid recommendation is required'),
  body('remarks').trim().notEmpty().withMessage('Jury remarks are required')
];
