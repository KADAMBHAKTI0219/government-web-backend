import DashboardService from '../services/DashboardService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getAdminDashboardStats();
  return ApiResponse.success(res, 'Admin dashboard statistics fetched', stats, 200);
});

export const getJuryDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getJuryDashboardStats(req.user._id);
  return ApiResponse.success(res, 'Jury dashboard statistics fetched', stats, 200);
});
