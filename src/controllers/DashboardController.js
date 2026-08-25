import DashboardService from '../services/DashboardService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getDashboardStats();
  return ApiResponse.success(res, 'Dashboard statistics and analytics fetched successfully', stats, 200);
});

export const getAdminDashboard = getDashboardStats;

export const getJuryDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getDashboardStats();
  return ApiResponse.success(res, 'Jury dashboard statistics fetched successfully', stats, 200);
});
