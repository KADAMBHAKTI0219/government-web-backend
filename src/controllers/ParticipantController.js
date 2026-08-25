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
  const {
    // Q1: Nomination As
    nominationType,
    nominationAs,

    // Q2 - Q9: Basic/Self Details
    name,
    fullName,
    phone,
    mobileNumber,
    email,
    gender,
    age,
    state,
    district,
    nationality,
    awardType,
    awardCategory,

    // Nominator Details (If THIRD_PARTY / for Others)
    nominator,
    nominatorFullName,
    nominatorNationality,
    nominatorPhone,
    nominatorEmail,

    // Nominee Details
    nominee,
    nomineeName,
    nomineeAwardType,
    nomineePhone,
    nomineeEmail,
    nomineeGender,
    nomineeAge,
    nomineeState,
    nomineeDistrict,

    // Category / Categories
    category,
    categoryId,
    categories,
    workSummary,
    description,
    contentUrl,
    submissionLink,
    bestStoryLink1,
    bestStoryLink2,
    bestStoryLink3,

    // Creator Profile
    creatorStartYear,
    whenBecomeCreator,

    // Social Media Platforms
    primaryPlatform,
    primaryPlatformName,
    primaryProfileUrl,
    profileUrl,
    primaryFollowers,
    noOfFollowers,

    secondaryPlatform,
    secondaryPlatformName,
    secondaryProfileUrl,
    secondaryFollowers,

    socialProfiles,
    status
  } = req.body;

  const resolvedNominationType = (nominationType || nominationAs || 'SELF').includes('Others') ? 'THIRD_PARTY' : 'SELF';
  const resolvedAwardType = awardType || awardCategory || 'National';

  // Process category details
  const resolvedCatId = await resolveCategory(category || categoryId || (categories && categories[0] && (categories[0].categoryId || categories[0].category)));

  // Normalize Category Array (up to 3)
  let normalizedCategories = [];
  if (Array.isArray(categories) && categories.length > 0) {
    normalizedCategories = await Promise.all(
      categories.slice(0, 3).map(async (c) => ({
        categoryId: await resolveCategory(c.categoryId || c.category),
        categoryTitle: c.categoryTitle || c.title || '',
        description: (c.description || c.workSummary || workSummary || '').substring(0, 2000),
        bestStoryLink1: c.bestStoryLink1 || c.storyLink1 || c.contentUrl || contentUrl || '',
        bestStoryLink2: c.bestStoryLink2 || c.storyLink2 || '',
        bestStoryLink3: c.bestStoryLink3 || c.storyLink3 || ''
      }))
    );
  } else {
    normalizedCategories = [{
      categoryId: resolvedCatId,
      categoryTitle: '',
      description: (description || workSummary || '').substring(0, 2000),
      bestStoryLink1: bestStoryLink1 || contentUrl || submissionLink || '',
      bestStoryLink2: bestStoryLink2 || '',
      bestStoryLink3: bestStoryLink3 || ''
    }];
  }

  // Parse Nominator object
  const nominatorData = {
    fullName: (nominator && nominator.fullName) || nominatorFullName || '',
    nationality: (nominator && nominator.nationality) || nominatorNationality || 'Indian',
    phone: (nominator && nominator.phone) || nominatorPhone || '',
    email: (nominator && nominator.email) || nominatorEmail || ''
  };

  // Parse Nominee object
  const nomineeData = {
    fullName: (nominee && (nominee.fullName || nominee.name)) || nomineeName || fullName || name || '',
    awardType: (nominee && nominee.awardType) || nomineeAwardType || resolvedAwardType,
    phone: (nominee && nominee.phone) || nomineePhone || '',
    email: (nominee && nominee.email) || nomineeEmail || '',
    gender: (nominee && nominee.gender) || nomineeGender || gender || 'Other',
    age: (nominee && nominee.age) || nomineeAge || age || '18-40',
    state: (nominee && nominee.state) || nomineeState || state || 'Chhattisgarh',
    district: (nominee && nominee.district) || nomineeDistrict || district || ''
  };

  // Parse Primary Platform
  const primaryPlatformObj = primaryPlatform && typeof primaryPlatform === 'object' ? primaryPlatform : {
    platform: primaryPlatformName || (typeof primaryPlatform === 'string' ? primaryPlatform : 'YouTube'),
    profileUrl: primaryProfileUrl || profileUrl || '',
    followers: primaryFollowers || noOfFollowers || '0',
    isPrimary: true
  };

  // Parse Secondary Platform
  const secondaryPlatformObj = secondaryPlatform && typeof secondaryPlatform === 'object' ? secondaryPlatform : {
    platform: secondaryPlatformName || (typeof secondaryPlatform === 'string' ? secondaryPlatform : ''),
    profileUrl: secondaryProfileUrl || '',
    followers: secondaryFollowers || '0',
    isPrimary: false
  };

  const participantData = {
    nominationType: resolvedNominationType,
    awardType: resolvedAwardType,
    name: name || fullName || nomineeData.fullName || nominatorData.fullName || 'Anonymous Creator',
    fullName: fullName || name || nomineeData.fullName || '',
    phone: phone || mobileNumber || nominatorData.phone || '9999999999',
    email: email || nominatorData.email || '',
    gender: gender || 'Other',
    age: age || '18-40',
    state: state || 'Chhattisgarh',
    district: district || nomineeData.district || 'Raipur',
    nationality: nationality || 'Indian',

    nominator: nominatorData,
    nominee: nomineeData,

    category: resolvedCatId || 'General',
    categories: normalizedCategories,

    workSummary: workSummary || description || normalizedCategories[0]?.description || 'Nomination submission',
    contentUrl: contentUrl || bestStoryLink1 || submissionLink || normalizedCategories[0]?.bestStoryLink1 || 'https://youtube.com',
    bestStoryLink1: bestStoryLink1 || contentUrl || submissionLink || normalizedCategories[0]?.bestStoryLink1 || '',
    bestStoryLink2: bestStoryLink2 || normalizedCategories[0]?.bestStoryLink2 || '',
    bestStoryLink3: bestStoryLink3 || normalizedCategories[0]?.bestStoryLink3 || '',

    creatorStartYear: creatorStartYear || whenBecomeCreator || '',
    whenBecomeCreator: whenBecomeCreator || creatorStartYear || '',

    primaryPlatform: primaryPlatformObj,
    secondaryPlatform: secondaryPlatformObj,
    socialProfiles: socialProfiles || [primaryPlatformObj, ...(secondaryPlatformObj.platform ? [secondaryPlatformObj] : [])],

    status: status || 'PENDING'
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
