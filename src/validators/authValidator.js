import { body } from 'express-validator';

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').trim().isEmail().withMessage('Valid email address is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('district').trim().notEmpty().withMessage('District is required'),
  body('instagramLink').optional({ checkFalsy: true }).trim(),
  body('videoLink').optional({ checkFalsy: true }).trim(),
  body('instagramReelUrl').optional({ checkFalsy: true }).trim()
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email address is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Valid email address is required')
];

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];
