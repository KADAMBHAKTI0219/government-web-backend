import ApplicationService from '../services/ApplicationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createApplication = asyncHandler(async (req, res) => {
  const application = await ApplicationService.createApplication(req.user._id, req.body);
  return ApiResponse.success(res, 'Application draft created successfully', application, 201);
});

export const submitApplication = asyncHandler(async (req, res) => {
  const submitted = await ApplicationService.submitApplication(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Application submitted successfully', submitted, 200);
});

export const updateDraft = asyncHandler(async (req, res) => {
  const updated = await ApplicationService.updateDraft(req.params.id, req.user._id, req.body);
  return ApiResponse.success(res, 'Draft updated successfully', updated, 200);
});

export const deleteDraft = asyncHandler(async (req, res) => {
  await ApplicationService.deleteDraft(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Draft deleted successfully', {}, 200);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No media file provided', [], 400);
  }
  const fileData = {
    fileUrl: `/uploads/${req.file.filename}`,
    fileType: req.body.fileType || 'document',
    fileName: req.file.originalname,
    fileSize: req.file.size
  };

  const updated = await ApplicationService.addMediaFile(req.params.id, req.user._id, fileData);
  return ApiResponse.success(res, 'Media uploaded to application successfully', updated, 200);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, remarks } = req.body;
  const updated = await ApplicationService.updateStatus(req.params.id, status, req.user._id, remarks);
  return ApiResponse.success(res, `Application status updated to ${status}`, updated, 200);
});

export const getApplications = asyncHandler(async (req, res) => {
  const result = await ApplicationService.getApplications(req.query);
  return ApiResponse.success(res, 'Applications fetched successfully', result, 200);
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await ApplicationService.getApplicationById(req.params.id);
  return ApiResponse.success(res, 'Application details fetched', application, 200);
});
