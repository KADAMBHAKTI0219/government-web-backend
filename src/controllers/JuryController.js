import JuryService from '../services/JuryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const assignJury = asyncHandler(async (req, res) => {
  const { juryId, nominationId, applicationId } = req.body;
  const targetId = nominationId || applicationId;
  const assignment = await JuryService.assignJury(juryId, targetId, req.user._id);
  return ApiResponse.success(res, 'Jury assigned to nomination successfully', assignment, 201);
});

export const getAssignedNominations = asyncHandler(async (req, res) => {
  const nominations = await JuryService.getAssignedNominations(req.user._id);
  return ApiResponse.success(res, 'Assigned nominations fetched for jury review', nominations, 200);
});

export const reviewNomination = asyncHandler(async (req, res) => {
  const nominationId = req.params.id || req.params.nominationId || req.params.applicationId;
  const review = await JuryService.submitJuryReview(req.user._id, nominationId, req.body);
  return ApiResponse.success(res, 'Nomination evaluated and scored successfully', review, 200);
});
