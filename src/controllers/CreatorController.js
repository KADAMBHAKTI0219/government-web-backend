import CreatorService from '../services/CreatorService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const updateSocialLinks = asyncHandler(async (req, res) => {
  const updated = await CreatorService.updateSocialLinks(req.user._id, req.body.socialLinks);
  return ApiResponse.success(res, 'Social media links updated', updated, 200);
});

export const updateAchievements = asyncHandler(async (req, res) => {
  const updated = await CreatorService.updateAchievements(req.user._id, req.body.achievements);
  return ApiResponse.success(res, 'Achievements updated', updated, 200);
});

export const uploadPortfolio = asyncHandler(async (req, res) => {
  const portfolioUrl = req.file ? `/uploads/${req.file.filename}` : req.body.portfolioUrl;
  const updated = await CreatorService.uploadPortfolio(req.user._id, portfolioUrl);
  return ApiResponse.success(res, 'Portfolio updated successfully', updated, 200);
});

export const getCreatorDashboard = asyncHandler(async (req, res) => {
  const dashboard = await CreatorService.getCreatorDashboard(req.user._id);
  return ApiResponse.success(res, 'Creator dashboard fetched successfully', dashboard, 200);
});
