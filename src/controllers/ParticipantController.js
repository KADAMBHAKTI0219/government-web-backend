import Participant from '../models/Participant.js';
import Category from '../models/Category.js';
import CategoryService from '../services/CategoryService.js';
import Location from '../models/Location.js';
import Nomination from '../models/Nomination.js';
import Counter from '../models/Counter.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

function escapeRegex(str) {
  if (!str) return '';
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function generateNextApplicationId() {
  const currentYear = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { id: `nomination_${currentYear}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seqFormatted = String(counter.seq).padStart(6, '0');
  return `NCA-${currentYear}-${seqFormatted}`;
}

/**
 * Helper function to resolve category input (ID, slug, or title) using RAM cached categories
 */
async function resolveCategory(catInput) {
  const categories = await CategoryService.getAllCategories(false);
  if (!catInput) {
    return categories[0] ? categories[0]._id : null;
  }

  // 1. Check if it's already a valid ObjectId or object
  const targetId = typeof catInput === 'string' ? catInput : (catInput._id ? String(catInput._id) : null);
  if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
    const existing = categories.find(c => String(c._id) === targetId);
    if (existing) return existing._id;
  }

  const strVal = String(typeof catInput === 'string' ? catInput : (catInput.title || catInput.name || catInput.slug || '')).toLowerCase().trim();
  const slugified = strVal.replace(/[^a-z0-9]+/g, '-');

  // 2. Search in RAM cached list
  const found = categories.find(c =>
    c.slug?.toLowerCase() === strVal ||
    c.slug?.toLowerCase() === slugified ||
    c.title?.toLowerCase() === strVal
  );

  if (found) {
    return found._id;
  }

  // 3. Fallback to first available category
  return categories[0] ? categories[0]._id : catInput;
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
    cityId,
    selectedCityId,
    districtId,
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
    nomineeCityId,

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

    // Video Link / Instagram Reel Link fields
    videoLink,
    mainVideoLink,
    reelUrl,
    videoUrl,
    instagramReelUrl,
    instagramLink,

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
  const resolvedCityId = cityId || selectedCityId || districtId || (nominee && nominee.cityId) || nomineeCityId || null;

  const resolvedVideoLink = instagramLink || videoLink || mainVideoLink || reelUrl || videoUrl || instagramReelUrl || contentUrl || bestStoryLink1 || '';

  // Process category details
  const resolvedCatId = await resolveCategory(category || categoryId || (categories && categories[0] && (categories[0].categoryId || categories[0].category)));

  // Normalize Category Array (up to 3)
  let normalizedCategories = [];
  if (Array.isArray(categories) && categories.length > 0) {
    normalizedCategories = await Promise.all(
      categories.slice(0, 3).map(async (c) => {
        const catVideo = c.instagramLink || c.videoLink || c.mainVideoLink || c.reelUrl || c.videoUrl || c.instagramReelUrl || c.bestStoryLink1 || c.storyLink1 || c.contentUrl || contentUrl || resolvedVideoLink || '';
        return {
          categoryId: await resolveCategory(c.categoryId || c.category),
          categoryTitle: c.categoryTitle || c.title || '',
          description: (c.description || c.workSummary || workSummary || '').substring(0, 2000),
          bestStoryLink1: c.bestStoryLink1 || c.storyLink1 || c.contentUrl || contentUrl || '',
          bestStoryLink2: c.bestStoryLink2 || c.storyLink2 || '',
          bestStoryLink3: c.bestStoryLink3 || c.storyLink3 || '',
          videoLink: catVideo,
          mainVideoLink: catVideo,
          reelUrl: catVideo,
          videoUrl: catVideo,
          instagramReelUrl: catVideo,
          instagramLink: catVideo,
          district: c.district || district || 'Raipur',
          cityId: c.cityId || resolvedCityId
        };
      })
    );
  } else {
    const defaultCatVideo = instagramLink || bestStoryLink1 || contentUrl || submissionLink || resolvedVideoLink || '';
    normalizedCategories = [{
      categoryId: resolvedCatId,
      categoryTitle: '',
      description: (description || workSummary || '').substring(0, 2000),
      bestStoryLink1: bestStoryLink1 || contentUrl || submissionLink || '',
      bestStoryLink2: bestStoryLink2 || '',
      bestStoryLink3: bestStoryLink3 || '',
      videoLink: defaultCatVideo,
      mainVideoLink: defaultCatVideo,
      reelUrl: defaultCatVideo,
      videoUrl: defaultCatVideo,
      instagramReelUrl: defaultCatVideo,
      instagramLink: defaultCatVideo,
      district: district || 'Raipur',
      cityId: resolvedCityId
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
    district: (nominee && nominee.district) || nomineeDistrict || district || '',
    cityId: (nominee && nominee.cityId) || nomineeCityId || resolvedCityId
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
    cityId: resolvedCityId,
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

    videoLink: resolvedVideoLink || normalizedCategories[0]?.videoLink || '',
    mainVideoLink: resolvedVideoLink || normalizedCategories[0]?.mainVideoLink || '',
    reelUrl: resolvedVideoLink || normalizedCategories[0]?.reelUrl || '',
    videoUrl: resolvedVideoLink || normalizedCategories[0]?.videoUrl || '',
    instagramReelUrl: resolvedVideoLink || normalizedCategories[0]?.instagramReelUrl || '',
    instagramLink: resolvedVideoLink || normalizedCategories[0]?.instagramLink || '',

    creatorStartYear: creatorStartYear || whenBecomeCreator || '',
    whenBecomeCreator: whenBecomeCreator || creatorStartYear || '',

    primaryPlatform: primaryPlatformObj,
    secondaryPlatform: secondaryPlatformObj,
    socialProfiles: socialProfiles || [primaryPlatformObj, ...(secondaryPlatformObj.platform ? [secondaryPlatformObj] : [])],

    status: status || 'PENDING'
  };

  const participant = await Participant.create(participantData);

  // Dual-write to Nomination collection asynchronously (non-blocking)
  generateNextApplicationId()
    .then(nextAppId => {
      return Nomination.create({
        applicationId: nextAppId,
        nominationType: resolvedNominationType,
        awardType: resolvedAwardType,
        applicant: {
          fullName: participantData.fullName || participantData.name,
          email: participantData.email || 'participant@cgawards.gov.in',
          phone: participantData.phone || '9999999999',
          gender: participantData.gender || 'Other',
          age: participantData.age || '18-40',
          state: participantData.state || 'Chhattisgarh',
          district: participantData.district || 'Raipur',
          nationality: participantData.nationality || 'Indian'
        },
        nominator: nominatorData,
        nominee: nomineeData,
        categories: normalizedCategories.map(c => ({
          categoryId: c.categoryId || resolvedCatId || 'General',
          categoryTitle: c.categoryTitle || 'General',
          description: c.description || workSummary || 'Nomination submission',
          storyLinks: {
            bestStoryLink1: c.bestStoryLink1 || contentUrl || 'https://youtube.com',
            bestStoryLink2: c.bestStoryLink2 || '',
            bestStoryLink3: c.bestStoryLink3 || ''
          },
          videoLink: c.videoLink || resolvedVideoLink || '',
          mainVideoLink: c.mainVideoLink || resolvedVideoLink || '',
          status: 'SUBMITTED'
        })),
        socialProfiles: participantData.socialProfiles,
        status: 'SUBMITTED',
        submittedAt: new Date()
      });
    })
    .catch(syncErr => logger.warn(`Nomination dual-write sync warning: ${syncErr.message}`));

  // Fetch category details from RAM cache to populate response without DB query
  const allCategories = await CategoryService.getAllCategories(false);
  const categoryObj = allCategories.find(c => String(c._id) === String(participant.category)) || null;

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
 * Helper function to populate full participant details (including category, nested categories, state and city details)
 */
async function formatParticipantFull(p) {
  if (!p) return null;
  const pObj = p.toObject ? p.toObject() : p;

  // 1. Resolve main category
  let categoryObj = null;
  if (mongoose.Types.ObjectId.isValid(pObj.category)) {
    categoryObj = await Category.findById(pObj.category).select('_id title slug icon tier prizeTier');
  }

  const categoryIdString = categoryObj ? categoryObj._id.toString() : (pObj.category?.toString() || '');
  const categoryTitleString = categoryObj ? categoryObj.title : (typeof pObj.category === 'string' ? pObj.category : 'General');

  // Resolved video link fallback
  const resolvedMainVideo = pObj.instagramLink || pObj.mainVideoLink || pObj.videoLink || pObj.reelUrl || pObj.videoUrl || pObj.instagramReelUrl || pObj.bestStoryLink1 || pObj.contentUrl || '';

  // 2. Resolve categories array items
  const populatedCategories = await Promise.all(
    (pObj.categories || []).map(async (catItem) => {
      let catDetails = null;
      if (mongoose.Types.ObjectId.isValid(catItem.categoryId)) {
        catDetails = await Category.findById(catItem.categoryId).select('_id title slug icon tier prizeTier');
      }
      const catVideo = catItem.instagramLink || catItem.mainVideoLink || catItem.videoLink || catItem.reelUrl || catItem.videoUrl || catItem.instagramReelUrl || catItem.bestStoryLink1 || resolvedMainVideo;
      return {
        ...catItem,
        videoLink: catVideo,
        mainVideoLink: catVideo,
        reelUrl: catVideo,
        videoUrl: catVideo,
        instagramReelUrl: catVideo,
        instagramLink: catVideo,
        categoryTitle: catDetails ? catDetails.title : (catItem.categoryTitle || 'General'),
        categoryDetails: catDetails
      };
    })
  );

  // 3. Resolve State & City Details from Location model if cityId or district exists
  let cityDetails = null;
  let stateLocationObj = null;

  if (pObj.cityId || pObj.district || pObj.state) {
    const matchedState = await Location.findOne({
      $or: [
        ...(pObj.cityId ? [{ 'cities._id': pObj.cityId }] : []),
        ...(pObj.state ? [{ stateName: new RegExp(`^${pObj.state.trim()}$`, 'i') }] : []),
        ...(pObj.district ? [{ 'cities.cityName': new RegExp(`^${pObj.district.trim()}$`, 'i') }] : [])
      ]
    });

    if (matchedState) {
      stateLocationObj = {
        _id: matchedState._id,
        stateName: matchedState.stateName,
        stateCode: matchedState.stateCode,
        country: matchedState.country
      };

      const foundCity = (matchedState.cities || []).find(
        c => (pObj.cityId && c._id.toString() === pObj.cityId.toString()) ||
             (pObj.district && c.cityName.toLowerCase() === pObj.district.trim().toLowerCase())
      );

      if (foundCity) {
        cityDetails = {
          _id: foundCity._id,
          cityName: foundCity.cityName,
          cityCode: foundCity.cityCode
        };
      }
    }
  }

  return {
    ...pObj,
    id: pObj._id,
    videoLink: resolvedMainVideo,
    mainVideoLink: resolvedMainVideo,
    reelUrl: resolvedMainVideo,
    videoUrl: resolvedMainVideo,
    instagramReelUrl: resolvedMainVideo,
    instagramLink: resolvedMainVideo,
    category: categoryIdString,
    categoryId: categoryIdString,
    categoryTitle: categoryTitleString,
    categoryDetails: categoryObj,
    categories: populatedCategories.length > 0 ? populatedCategories : [{
      categoryId: categoryIdString,
      categoryTitle: categoryTitleString,
      description: pObj.workSummary || pObj.description || '',
      bestStoryLink1: pObj.bestStoryLink1 || pObj.contentUrl || '',
      bestStoryLink2: pObj.bestStoryLink2 || '',
      bestStoryLink3: pObj.bestStoryLink3 || '',
      videoLink: resolvedMainVideo,
      mainVideoLink: resolvedMainVideo,
      reelUrl: resolvedMainVideo,
      videoUrl: resolvedMainVideo,
      instagramReelUrl: resolvedMainVideo,
      instagramLink: resolvedMainVideo,
      district: pObj.district,
      cityId: pObj.cityId,
      categoryDetails: categoryObj
    }],
    cityDetails,
    stateDetails: stateLocationObj
  };
}

/**
 * Admin route: Get all participants
 * GET /api/v1/participants
 */
export const getParticipants = asyncHandler(async (req, res) => {
  const rawParticipants = await Participant.find().sort('-createdAt');
  const participants = await Promise.all(rawParticipants.map(p => formatParticipantFull(p)));

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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return ApiResponse.error(res, 'Invalid participant ID', [], 400);
  }
  const participant = await Participant.findById(id);
  if (!participant) {
    return ApiResponse.error(res, 'Participant not found', [], 404);
  }

  const responseData = await formatParticipantFull(participant);

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

  const responseData = await formatParticipantFull(participant);

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
