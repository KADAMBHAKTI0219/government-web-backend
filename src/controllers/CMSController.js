import CMSService from '../services/CMSService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCMSSection = asyncHandler(async (req, res) => {
  const section = await CMSService.getCMSSection(req.params.key);
  return ApiResponse.success(res, `CMS section '${req.params.key}' fetched`, section, 200);
});

export const updateCMSSection = asyncHandler(async (req, res) => {
  const updated = await CMSService.updateCMSSection(req.params.key, req.user._id, req.body);
  return ApiResponse.success(res, `CMS section '${req.params.key}' updated`, updated, 200);
});

export const getAllCMS = asyncHandler(async (req, res) => {
  const allSections = await CMSService.getAllCMS();
  return ApiResponse.success(res, 'All CMS sections fetched', allSections, 200);
});
