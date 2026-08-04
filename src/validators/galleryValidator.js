import { body } from 'express-validator';

export const galleryValidator = [
  body('albumName').trim().notEmpty().withMessage('Album name is required')
];
