import Participant from '../models/Participant.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const registerParticipant = asyncHandler(async (req, res) => {
  const participant = await Participant.create(req.body);
  return ApiResponse.success(res, 'Participant registered successfully', participant, 201);
});

export const getParticipants = asyncHandler(async (req, res) => {
  const participants = await Participant.find().populate('category', 'title slug tier');
  return ApiResponse.success(res, 'Participants list retrieved successfully', participants);
});
