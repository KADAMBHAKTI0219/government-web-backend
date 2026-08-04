import NotificationService from '../services/NotificationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUserNotifications = asyncHandler(async (req, res) => {
  const result = await NotificationService.getUserNotifications(req.user._id, req.query);
  return ApiResponse.success(res, 'Notifications fetched successfully', result, 200);
});

export const markRead = asyncHandler(async (req, res) => {
  const updated = await NotificationService.markRead(req.params.id, req.user._id);
  return ApiResponse.success(res, 'Notification marked as read', updated, 200);
});

export const broadcastAnnouncement = asyncHandler(async (req, res) => {
  const notification = await NotificationService.broadcastAnnouncement(req.body);
  return ApiResponse.success(res, 'Broadcast announcement created', notification, 201);
});
