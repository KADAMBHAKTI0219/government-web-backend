import ContactService from '../services/ContactService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const submitQuery = asyncHandler(async (req, res) => {
  const contactQuery = await ContactService.submitQuery(req.body);
  return ApiResponse.success(res, 'Your message has been received. We will respond shortly.', contactQuery, 201);
});

export const getAllQueries = asyncHandler(async (req, res) => {
  const result = await ContactService.getAllQueries(req.query);
  return ApiResponse.success(res, 'Contact queries fetched', result, 200);
});

export const resolveQuery = asyncHandler(async (req, res) => {
  const updated = await ContactService.resolveQuery(req.params.id, req.user._id, req.body.resolutionNotes);
  return ApiResponse.success(res, 'Query marked as resolved', updated, 200);
});
