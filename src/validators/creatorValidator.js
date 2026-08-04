import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional().trim(),
  body('district').optional().trim().notEmpty().withMessage('District cannot be empty'),
  body('gender').optional().isIn(['Male', 'Female', 'Other', 'Prefer Not to Say']),
  body('dob').optional().isISO8601().withMessage('Valid Date of Birth is required'),
  body('portfolioUrl').optional().isURL().withMessage('Valid portfolio URL required')
];

export const socialLinksValidator = [
  body('socialLinks').isArray().withMessage('socialLinks must be an array'),
  body('socialLinks.*.platform')
    .isIn(['youtube', 'instagram', 'facebook', 'twitter', 'linkedin', 'other'])
    .withMessage('Invalid social platform'),
  body('socialLinks.*.url').isURL().withMessage('Valid URL is required for social link')
];
