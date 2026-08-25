import VotingService from '../services/VotingService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const castVote = asyncHandler(async (req, res) => {
  const nominationId = req.params.nominationId || req.params.id || req.body.nominationId || req.body.applicationId;
  const voterData = {
    voterIp: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    voterUserAgent: req.headers['user-agent'],
    voterEmail: req.body.voterEmail,
    voterPhone: req.body.voterPhone,
    voterUser: req.user ? req.user._id : null
  };

  const result = await VotingService.castVote(nominationId, voterData);
  return ApiResponse.success(res, result.message, result, 201);
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await VotingService.getLeaderboard(req.query.category || req.query.categoryId);
  return ApiResponse.success(res, 'Leaderboard and vote standings retrieved', leaderboard, 200);
});
