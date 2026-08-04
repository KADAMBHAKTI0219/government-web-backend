import VotingService from '../services/VotingService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const castVote = asyncHandler(async (req, res) => {
  const vote = await VotingService.castVote({
    applicationId: req.body.applicationId,
    voterIp: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    voterUserAgent: req.headers['user-agent'],
    fingerprint: req.body.fingerprint,
    voterUser: req.user || null,
    voterEmail: req.body.voterEmail
  });

  return ApiResponse.success(res, 'Vote recorded successfully!', vote, 201);
});

export const getVotingAnalytics = asyncHandler(async (req, res) => {
  const analytics = await VotingService.getVotingAnalytics(req.query.category);
  return ApiResponse.success(res, 'Voting analytics and leaderboard fetched', analytics, 200);
});
