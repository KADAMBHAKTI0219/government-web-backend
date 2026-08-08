import Participant from '../models/Participant.js';
import Category from '../models/Category.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * Helper function to resolve category input (ID, slug, or title) to a valid Category ObjectId
 */
async function resolveCategory(catInput) {
  if (!catInput) {
    const firstCat = await Category.findOne();
    return firstCat ? firstCat._id : null;
  }

  // 1. Check if it's already a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(catInput)) {
    const existing = await Category.findById(catInput);
    if (existing) return existing._id;
  }

  // 2. Search by slug or title (case-insensitive)
  const categoryBySlugOrTitle = await Category.findOne({
    $or: [
      { slug: catInput },
      { title: catInput },
      { slug: catInput.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') },
      { title: new RegExp(`^${catInput.toString().trim()}$`, 'i') }
    ]
  });

  if (categoryBySlugOrTitle) {
    return categoryBySlugOrTitle._id;
  }

  // 3. Fallback to first available category
  const firstCat = await Category.findOne();
  if (firstCat) {
    return firstCat._id;
  }

  return catInput;
}

/**
 * Public route: Register / Nominate Participant
 * POST /api/v1/participants/register
 */
export const registerParticipant = asyncHandler(async (req, res) => {
  const { name, fullName, phone, email, district, category, categoryId, workSummary, contentUrl, submissionLink } = req.body;

  const resolvedCatId = await resolveCategory(category || categoryId);

  const participantData = {
    name: name || fullName || 'Anonymous Creator',
    phone: phone || '9999999999',
    email: email || '',
    district: district || 'Raipur',
    category: resolvedCatId || 'General',
    workSummary: workSummary || 'Nomination submission',
    contentUrl: contentUrl || submissionLink || 'https://youtube.com'
  };

  const participant = await Participant.create(participantData);

  // Fetch category details to populate response
  let categoryObj = null;
  if (mongoose.Types.ObjectId.isValid(participant.category)) {
    categoryObj = await Category.findById(participant.category).select('_id title slug icon');
  }

  const categoryIdString = categoryObj ? categoryObj._id.toString() : participant.category?.toString();
  const categoryTitleString = categoryObj ? categoryObj.title : (typeof participant.category === 'string' ? participant.category : 'General');

  const responseData = {
    ...participant.toObject(),
    category: categoryIdString,
    categoryId: categoryIdString,
    categoryTitle: categoryTitleString,
    categoryDetails: categoryObj
  };

  return res.status(201).json({
    success: true,
    message: 'Participant registered successfully',
    data: responseData,
    participant: responseData
  });
});

/**
 * Admin route: Get all participants
 * GET /api/v1/participants
 */
export const getParticipants = asyncHandler(async (req, res) => {
  const rawParticipants = await Participant.find().sort('-createdAt');

  const participants = await Promise.all(
    rawParticipants.map(async (p) => {
      const pObj = p.toObject();
      let categoryObj = null;
      if (mongoose.Types.ObjectId.isValid(p.category)) {
        categoryObj = await Category.findById(p.category).select('_id title slug icon');
      }

      const categoryIdString = categoryObj ? categoryObj._id.toString() : p.category?.toString();
      const categoryTitleString = categoryObj ? categoryObj.title : (typeof p.category === 'string' ? p.category : 'General');

      return {
        ...pObj,
        category: categoryIdString,
        categoryId: categoryIdString,
        categoryTitle: categoryTitleString,
        categoryDetails: categoryObj
      };
    })
  );

  return res.status(200).json({
    success: true,
    message: 'Participants list retrieved successfully',
    data: participants,
    participants
  });
});

/**
 * Admin route: Get participant details by ID
 * GET /api/v1/participants/:id
 */
export const getParticipantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const participant = await Participant.findById(id);
  if (!participant) {
    return ApiResponse.error(res, 'Participant not found', 404);
  }

  const pObj = participant.toObject();
  let categoryObj = null;
  if (mongoose.Types.ObjectId.isValid(participant.category)) {
    categoryObj = await Category.findById(participant.category).select('_id title slug icon');
  }

  const categoryIdString = categoryObj ? categoryObj._id.toString() : participant.category?.toString();
  const categoryTitleString = categoryObj ? categoryObj.title : (typeof participant.category === 'string' ? participant.category : 'General');

  const responseData = {
    ...pObj,
    category: categoryIdString,
    categoryId: categoryIdString,
    categoryTitle: categoryTitleString,
    categoryDetails: categoryObj
  };

  return res.status(200).json({
    success: true,
    message: 'Participant details retrieved successfully',
    data: responseData,
    participant: responseData
  });
});

/**
 * Admin route: Update participant details
 * PUT /api/v1/participants/:id
 */
export const updateParticipant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.body.category || req.body.categoryId) {
    req.body.category = await resolveCategory(req.body.category || req.body.categoryId);
  }

  const participant = await Participant.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  if (!participant) {
    return ApiResponse.error(res, 'Participant not found', 404);
  }

  let categoryObj = null;
  if (mongoose.Types.ObjectId.isValid(participant.category)) {
    categoryObj = await Category.findById(participant.category).select('_id title slug icon');
  }

  const categoryIdString = categoryObj ? categoryObj._id.toString() : participant.category?.toString();
  const categoryTitleString = categoryObj ? categoryObj.title : (typeof participant.category === 'string' ? participant.category : 'General');

  const responseData = {
    ...participant.toObject(),
    category: categoryIdString,
    categoryId: categoryIdString,
    categoryTitle: categoryTitleString,
    categoryDetails: categoryObj
  };

  return res.status(200).json({
    success: true,
    message: 'Participant updated successfully',
    data: responseData,
    participant: responseData
  });
});

/**
 * Admin route: Delete participant
 * DELETE /api/v1/participants/:id
 */
export const deleteParticipant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let participant = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    participant = await Participant.findByIdAndDelete(id);
  } else {
    participant = await Participant.findOneAndDelete({ _id: id });
  }

  if (!participant) {
    return ApiResponse.error(res, 'Participant not found or already deleted', 404);
  }

  return ApiResponse.success(res, 'Participant deleted successfully', { id: participant._id });
});
