import UserService from '../services/UserService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.getProfile(req.user._id);
  return ApiResponse.success(res, 'User profile fetched successfully', profile, 200);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await UserService.updateProfile(req.user._id, req.body);
  return ApiResponse.success(res, 'Profile updated successfully', updated, 200);
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No file uploaded', [], 400);
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  const updated = await UserService.uploadProfileImage(req.user._id, imageUrl);
  return ApiResponse.success(res, 'Profile image uploaded successfully', updated, 200);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await UserService.deleteAccount(req.user._id);
  return ApiResponse.success(res, 'Account deleted successfully', {}, 200);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  return ApiResponse.success(res, 'Users fetched successfully', result, 200);
});
