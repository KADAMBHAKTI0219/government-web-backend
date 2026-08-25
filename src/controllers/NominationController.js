import NominationService from '../services/NominationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * POST /api/v1/nominations
 * Create Self or Third-Party Nomination (Draft or Submission)
 */
export const createNomination = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const nomination = await NominationService.saveDraft(req.body, userId);
  return ApiResponse.success(res, 'Nomination draft created successfully', nomination, 201);
});

/**
 * POST /api/v1/nominations/draft
 */
export const saveDraft = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const draft = await NominationService.saveDraft(req.body, userId);
  return ApiResponse.success(res, 'Nomination draft saved successfully', draft, 200);
});

/**
 * PUT /api/v1/nominations/:id/draft
 */
export const updateDraft = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const draftData = { ...req.body, id: req.params.id };
  const updated = await NominationService.saveDraft(draftData, userId);
  return ApiResponse.success(res, 'Draft updated successfully', updated, 200);
});

/**
 * GET /api/v1/nominations/my-drafts
 */
export const getMyDrafts = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const email = req.user ? req.user.email : '';
  const drafts = await NominationService.getMyDrafts(userId, email);
  return ApiResponse.success(res, 'Drafts fetched successfully', drafts, 200);
});

/**
 * POST /api/v1/nominations/:id/submit
 */
export const submitNomination = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user._id : null;
  const submitted = await NominationService.submitNomination(req.params.id, userId);
  return ApiResponse.success(res, 'Nomination application submitted successfully', submitted, 200);
});

/**
 * GET /api/v1/nominations/track/:applicationId
 */
export const trackApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const trackingData = await NominationService.trackApplication(applicationId);
  return ApiResponse.success(res, 'Application status retrieved', trackingData, 200);
});
