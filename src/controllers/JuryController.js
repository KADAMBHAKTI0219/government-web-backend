import JuryService from '../services/JuryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const assignJury = asyncHandler(async (req, res) => {
  const { juryId, applicationId } = req.body;
  const assignment = await JuryService.assignJury(req.user._id, juryId, applicationId);
  return ApiResponse.success(res, 'Jury assigned to application successfully', assignment, 201);
});

export const getAssignedApplications = asyncHandler(async (req, res) => {
  const result = await JuryService.getJuryAssignedApplications(req.user._id, req.query);
  return ApiResponse.success(res, 'Assigned applications fetched for review', result, 200);
});

export const scoreApplication = asyncHandler(async (req, res) => {
  const score = await JuryService.scoreApplication(req.user._id, req.params.applicationId, req.body);
  return ApiResponse.success(res, 'Application evaluated and scored successfully', score, 200);
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await JuryService.getLeaderboard(req.query.category);
  return ApiResponse.success(res, 'Jury evaluation leaderboard fetched', leaderboard, 200);
});
