import Winner from '../models/Winner.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Public route: Get all declared winners
 * GET /api/v1/winners
 */
export const getWinners = asyncHandler(async (req, res) => {
  const winners = await Winner.find()
    .populate('categoryId', 'title slug icon')
    .populate('creatorId', 'name email profileImage district')
    .sort('-createdAt');

  return ApiResponse.success(res, 'Winners list retrieved successfully', winners, 200);
});
