import Participant from '../models/Participant.js';
import Category from '../models/Category.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

async function resolveCategory(catInput) {
  if (!catInput) return null;

  if (mongoose.Types.ObjectId.isValid(catInput)) {
    const existing = await Category.findById(catInput);
    if (existing) return existing._id;
  }

  const categoryBySlugOrTitle = await Category.findOne({
    $or: [
      { slug: catInput },
      { title: catInput },
      { slug: catInput.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') }
    ]
  });

  if (categoryBySlugOrTitle) {
    return categoryBySlugOrTitle._id;
  }

  const firstCat = await Category.findOne();
  if (firstCat) {
    return firstCat._id;
  }

  return catInput;
}

export const registerParticipant = asyncHandler(async (req, res) => {
  const { name, fullName, phone, email, district, category, categoryId, workSummary, contentUrl } = req.body;

  const resolvedCat = await resolveCategory(category || categoryId);

  const participantData = {
    name: name || fullName || 'Anonymous Creator',
    phone: phone || '9999999999',
    email: email || '',
    district: district || 'Raipur',
    category: resolvedCat || 'General',
    workSummary: workSummary || 'Nomination submission',
    contentUrl: contentUrl || 'https://youtube.com'
  };

  const participant = await Participant.create(participantData);
  return ApiResponse.success(res, 'Participant registered successfully', participant, 201);
});

export const getParticipants = asyncHandler(async (req, res) => {
  const participants = await Participant.find().sort('-createdAt');
  return ApiResponse.success(res, 'Participants list retrieved successfully', participants);
});
