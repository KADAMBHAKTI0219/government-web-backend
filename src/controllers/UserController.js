import UserService from '../services/UserService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.getProfile(req.user._id);
  return ApiResponse.success(res, 'User profile fetched successfully', profile, 200);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await UserService.updateProfile(req.user._id, req.body);
  return ApiResponse.success(res, 'Profile updated successfully', updated, 200);
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  let file = req.file;

  if (!file && req.files) {
    if (Array.isArray(req.files) && req.files.length > 0) {
      file = req.files[0];
    } else if (typeof req.files === 'object') {
      file =
        (req.files.profileImage && req.files.profileImage[0]) ||
        (req.files.avatar && req.files.avatar[0]) ||
        (req.files.image && req.files.image[0]) ||
        (req.files.file && req.files.file[0]) ||
        Object.values(req.files).flat()[0];
    }
  }

  if (!file) {
    return ApiResponse.error(res, 'No image file uploaded', [], 400);
  }

  const imageUrl = await uploadToCloudinary(file, 'profile_pictures');
  const updated = await UserService.uploadProfileImage(req.user._id, imageUrl);

  return ApiResponse.success(
    res,
    'Profile image uploaded successfully',
    {
      user: updated,
      profileImage: imageUrl,
      avatar: imageUrl,
      url: imageUrl
    },
    200
  );
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await UserService.deleteAccount(req.user._id);
  return ApiResponse.success(res, 'Account deleted successfully', {}, 200);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);
  return res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: result.users,
    users: result.users,
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});
