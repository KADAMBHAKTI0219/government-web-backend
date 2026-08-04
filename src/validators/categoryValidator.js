import { body } from 'express-validator';

export const createCategoryValidator = [
  body('title').trim().notEmpty().withMessage('Category title is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('tier')
    .optional()
    .isIn(['A_CULTURE_IDENTITY', 'B_NATION_STATE_BUILDING', 'C_CRAFT_PLATFORM', 'GENERAL']),
  body('prizeTier').optional().isIn(['FLAGSHIP', 'MARQUEE', 'STANDARD', 'SPECIAL']),
  body('cashPrizeMin').optional().isNumeric().withMessage('cashPrizeMin must be a number'),
  body('cashPrizeMax').optional().isNumeric().withMessage('cashPrizeMax must be a number')
];

export const updateCategoryValidator = [
  body('title').optional().trim().notEmpty().withMessage('Category title cannot be empty'),
  body('shortDescription').optional().trim().notEmpty().withMessage('Short description cannot be empty')
];
