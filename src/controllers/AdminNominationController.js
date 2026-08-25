import Nomination from '../models/Nomination.js';
import Tier1Review from '../models/Tier1Review.js';
import Tier2Review from '../models/Tier2Review.js';
import Tier3Review from '../models/Tier3Review.js';
import ComplianceReview from '../models/ComplianceReview.js';
import JuryReview from '../models/JuryReview.js';
import Winner from '../models/Winner.js';
import ReviewService from '../services/ReviewService.js';
import JuryService from '../services/JuryService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

/**
 * GET /api/v1/admin/nominations
 * List and filter nominations with search, status, category, district, platform, date range, pagination
 */
export const getNominations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    category,
    district,
    platform,
    startDate,
    endDate,
    sortBy = '-createdAt'
  } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (category) {
    query.$or = [
      { 'categories.categoryId': category },
      { 'categories.categoryTitle': { $regex: category, $options: 'i' } }
    ];
  }

  if (district) {
    query['applicant.district'] = { $regex: district, $options: 'i' };
  }

  if (platform) {
    query['socialProfiles.platform'] = { $regex: platform, $options: 'i' };
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { applicationId: { $regex: search, $options: 'i' } },
      { 'applicant.fullName': { $regex: search, $options: 'i' } },
      { 'applicant.email': { $regex: search, $options: 'i' } },
      { 'applicant.phone': { $regex: search, $options: 'i' } },
      { 'nominee.name': { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const total = await Nomination.countDocuments(query);
  const nominations = await Nomination.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limitNum);

  return ApiResponse.success(res, 'Nominations retrieved successfully', {
    nominations,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  }, 200);
});

/**
 * GET /api/v1/admin/nominations/:id
 * Retrieve detailed nomination details including reviews
 */
export const getNominationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const nomination = await Nomination.findOne({
    $or: [
      ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : []),
      { applicationId: id }
    ]
  });

  if (!nomination) {
    return ApiResponse.error(res, 'Nomination not found', 404);
  }

  const tier1 = await Tier1Review.find({ nominationId: nomination._id }).populate('reviewerId', 'name email');
  const tier2 = await Tier2Review.find({ nominationId: nomination._id }).populate('reviewerId', 'name email');
  const tier3 = await Tier3Review.find({ nominationId: nomination._id }).populate('reviewerId', 'name email');
  const compliance = await ComplianceReview.find({ nominationId: nomination._id }).populate('reviewerId', 'name email');
  const juryReviews = await JuryReview.find({ nominationId: nomination._id }).populate('juryId', 'name email');
  const winner = await Winner.findOne({ nominationId: nomination._id });

  return ApiResponse.success(res, 'Nomination details fetched', {
    nomination,
    reviews: {
      tier1,
      tier2,
      tier3,
      compliance,
      juryReviews,
      winner
    }
  }, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/eligibility
 */
export const eligibilityReview = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const reviewerRole = req.user.role || 'ADMIN';
  const updated = await ReviewService.eligibilityReview(req.params.id, req.body, reviewerId, reviewerRole);
  return ApiResponse.success(res, 'Eligibility review updated', updated, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/preliminary
 */
export const preliminaryAssessment = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const reviewerRole = req.user.role || 'ADMIN';
  const updated = await ReviewService.preliminaryAssessment(req.params.id, req.body, reviewerId, reviewerRole);
  return ApiResponse.success(res, 'Preliminary assessment recorded', updated, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/shortlist
 */
export const shortlistNomination = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const reviewerRole = req.user.role || 'ADMIN';
  const updated = await ReviewService.shortlistNomination(req.params.id, req.body, reviewerId, reviewerRole);
  return ApiResponse.success(res, 'Nomination shortlisted', updated, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/tier1
 */
export const submitTier1Review = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const result = await ReviewService.submitTier1Review(req.params.id, req.body, reviewerId);
  return ApiResponse.success(res, 'Tier 1 review submitted', result, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/tier2
 */
export const submitTier2Review = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const result = await ReviewService.submitTier2Review(req.params.id, req.body, reviewerId);
  return ApiResponse.success(res, 'Tier 2 review submitted', result, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/tier3
 */
export const submitTier3Review = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const result = await ReviewService.submitTier3Review(req.params.id, req.body, reviewerId);
  return ApiResponse.success(res, 'Tier 3 review submitted', result, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/compliance
 */
export const submitComplianceReview = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const result = await ReviewService.submitComplianceReview(req.params.id, req.body, reviewerId);
  return ApiResponse.success(res, 'Brand safety review submitted', result, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/jury-assign
 */
export const assignJury = asyncHandler(async (req, res) => {
  const { juryId } = req.body;
  const assignedById = req.user._id;
  const result = await JuryService.assignJury(juryId, req.params.id, assignedById);
  return ApiResponse.success(res, 'Jury assigned to nomination successfully', result, 200);
});

/**
 * POST /api/v1/admin/nominations/:id/winner
 */
export const declareWinner = asyncHandler(async (req, res) => {
  const adminId = req.user._id;
  const result = await ReviewService.declareWinner(req.params.id, req.body, adminId);
  return ApiResponse.success(res, 'Winner declared successfully', result, 200);
});
