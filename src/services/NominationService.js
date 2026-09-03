import Nomination from '../models/Nomination.js';
import Counter from '../models/Counter.js';
import ApplicationStatusHistory from '../models/ApplicationStatusHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import CategoryResolver from '../utils/categoryResolver.js';
import { APPLICATION_STATUS, APPLICATION_STAGE } from '../constants/applicationStatuses.js';
import mongoose from 'mongoose';

/**
 * Helper to generate sequential Application ID atomically (Format: NCA-2026-000001)
 */
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
 * Helper to resolve category details using RAM cached CategoryResolver
 */
async function resolveCategoryDetails(catInput) {
  return await CategoryResolver.resolveDetails(catInput);
}


class NominationService {
  /**
   * Create or save draft nomination matching Creators Awards Form.xlsx fields
   */
  async saveDraft(data, userId = null) {
    const {
      id,
      nominationType = 'SELF',
      awardType = 'National',
      applicant = {},
      nominator = {},
      nominee = {},
      categories = [],
      creatorProfile = {},
      socialProfiles = [],
      declaration = false
    } = data;

    // Validate category count: Max 3 categories allowed per Excel spec
    if (Array.isArray(categories) && categories.length > 3) {
      throw new Error('Maximum 3 categories allowed per nomination.');
    }

    const rootVideoLink = data.instagramLink || data.videoLink || data.mainVideoLink || data.reelUrl || data.videoUrl || data.instagramReelUrl || '';

    // Process category items matching Excel columns (Description max 2000 chars, Story Link 1)
    const processedCategories = await Promise.all(
      (categories || []).slice(0, 3).map(async (c) => {
        const catObj = await resolveCategoryDetails(c.categoryId || c.category);
        const catVideo = c.instagramLink || c.videoLink || c.mainVideoLink || c.reelUrl || c.videoUrl || c.instagramReelUrl || c.storyLinks?.bestStoryLink1 || c.bestStoryLink1 || c.storyLink1 || rootVideoLink || '';
        return {
          categoryId: catObj ? catObj._id : (c.categoryId || c.category || 'General'),
          categoryTitle: catObj ? catObj.title : (c.categoryTitle || 'General'),
          description: (c.description || '').substring(0, 2000),
          storyLinks: {
            bestStoryLink1: c.storyLinks?.bestStoryLink1 || c.bestStoryLink1 || c.storyLink1 || '',
            bestStoryLink2: c.storyLinks?.bestStoryLink2 || c.bestStoryLink2 || c.storyLink2 || '',
            bestStoryLink3: c.storyLinks?.bestStoryLink3 || c.bestStoryLink3 || c.storyLink3 || ''
          },
          videoLink: catVideo,
          mainVideoLink: catVideo,
          reelUrl: catVideo,
          videoUrl: catVideo,
          instagramReelUrl: catVideo,
          instagramLink: catVideo,
          status: 'DRAFT',
          reviewRemarks: ''
        };
      })
    );

    const applicantData = {
      userId: userId || applicant.userId,
      fullName: applicant.fullName || applicant.name || 'Draft Applicant',
      email: applicant.email || '',
      phone: applicant.phone || applicant.mobileNumber || '',
      gender: applicant.gender || 'Other',
      age: applicant.age ? String(applicant.age) : '18-40',
      state: applicant.state || 'Chhattisgarh',
      district: applicant.district || 'Raipur',
      nationality: applicant.nationality || (awardType === 'International' ? 'International' : 'Indian')
    };

    const nominatorData = (nominationType === 'THIRD_PARTY' || nominationType === 'Nominator(for Others)') ? {
      fullName: nominator.fullName || nominator.nominatorFullName || nominator.name || data.nominatorFullName || '',
      nationality: nominator.nationality || nominator.nominatorNationality || data.nominatorNationality || 'Indian',
      email: nominator.email || nominator.nominatorEmail || data.nominatorEmail || '',
      phone: nominator.phone || nominator.mobile || nominator.nominatorPhone || data.nominatorPhone || ''
    } : {};

    const nomineeData = nominationType === 'THIRD_PARTY' ? {
      name: nominee.name || nominee.nomineeName || nominee.fullName || '',
      email: nominee.email || '',
      phone: nominee.phone || '',
      gender: nominee.gender || 'Other',
      age: nominee.age ? String(nominee.age) : '18-40',
      state: nominee.state || 'Chhattisgarh',
      district: nominee.district || ''
    } : {
      name: applicantData.fullName,
      email: applicantData.email,
      phone: applicantData.phone,
      gender: applicantData.gender,
      age: applicantData.age,
      state: applicantData.state,
      district: applicantData.district
    };

    const creatorProfileData = {
      creatorStartYear: creatorProfile.creatorStartYear || creatorProfile.whenBecomeCreator || String(new Date().getFullYear()),
      bio: creatorProfile.bio || '',
      portfolioUrl: creatorProfile.portfolioUrl || ''
    };

    let nomination;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      nomination = await Nomination.findById(id);
      if (nomination && nomination.status !== APPLICATION_STATUS.DRAFT) {
        throw new Error('Cannot update draft. Application has already been submitted.');
      }
    }

    const resolvedVideoLink = rootVideoLink || processedCategories[0]?.videoLink || '';

    if (nomination) {
      nomination.nominationType = nominationType;
      nomination.awardType = awardType;
      nomination.applicant = applicantData;
      nomination.nominator = nominatorData;
      nomination.nominee = nomineeData;
      nomination.categories = processedCategories;
      nomination.videoLink = resolvedVideoLink;
      nomination.mainVideoLink = resolvedVideoLink;
      nomination.reelUrl = resolvedVideoLink;
      nomination.videoUrl = resolvedVideoLink;
      nomination.instagramReelUrl = resolvedVideoLink;
      nomination.instagramLink = resolvedVideoLink;
      nomination.creatorProfile = creatorProfileData;
      nomination.socialProfiles = socialProfiles;
      nomination.declaration = declaration;
      nomination.status = APPLICATION_STATUS.DRAFT;
      nomination.currentStage = APPLICATION_STAGE.SUBMISSION;
      await nomination.save();
    } else {
      nomination = await Nomination.create({
        nominationType,
        awardType,
        applicant: applicantData,
        nominator: nominatorData,
        nominee: nomineeData,
        categories: processedCategories,
        videoLink: resolvedVideoLink,
        mainVideoLink: resolvedVideoLink,
        reelUrl: resolvedVideoLink,
        videoUrl: resolvedVideoLink,
        instagramReelUrl: resolvedVideoLink,
        instagramLink: resolvedVideoLink,
        creatorProfile: creatorProfileData,
        socialProfiles,
        declaration,
        status: APPLICATION_STATUS.DRAFT,
        currentStage: APPLICATION_STAGE.SUBMISSION,
        timeline: [{
          status: APPLICATION_STATUS.DRAFT,
          stage: APPLICATION_STAGE.SUBMISSION,
          changedBy: userId,
          remarks: 'Draft nomination created.'
        }]
      });
    }

    return nomination;
  }

  /**
   * Final submission of nomination application
   */
  async submitNomination(id, userId = null) {
    const nomination = await Nomination.findById(id);
    if (!nomination) {
      throw new Error('Nomination draft not found.');
    }

    if (nomination.status !== APPLICATION_STATUS.DRAFT) {
      throw new Error(`Nomination is already in ${nomination.status} status and cannot be re-submitted.`);
    }

    // Excel Validation 1: At least 1 and max 3 categories
    if (!nomination.categories || nomination.categories.length === 0) {
      throw new Error('At least 1 category must be selected for nomination.');
    }
    if (nomination.categories.length > 3) {
      throw new Error('Maximum 3 categories allowed per nomination.');
    }

    // Excel Validation 2: Story Link 1 mandatory & description <= 2000 chars
    for (const cat of nomination.categories) {
      if (!cat.storyLinks || !cat.storyLinks.bestStoryLink1) {
        throw new Error(`Category requires at least Best Story Link 1.`);
      }
      if (cat.description && cat.description.length > 2000) {
        throw new Error(`Category description exceeds 2000 characters limit.`);
      }
    }

    // Excel Validation 3: Primary Social Platform (Highest followers) mandatory
    if (!nomination.socialProfiles || nomination.socialProfiles.length === 0) {
      throw new Error('Please select your primary social media platform (Highest followers).');
    }
    const hasPrimary = nomination.socialProfiles.some(p => p.isPrimary);
    if (!hasPrimary) {
      nomination.socialProfiles[0].isPrimary = true;
    }

    // Generate atomic Application ID if not present
    if (!nomination.applicationId) {
      nomination.applicationId = await generateNextApplicationId();
    }

    nomination.status = APPLICATION_STATUS.SUBMITTED;
    nomination.currentStage = APPLICATION_STAGE.SUBMISSION;
    nomination.submittedAt = new Date();

    nomination.timeline.push({
      status: APPLICATION_STATUS.SUBMITTED,
      stage: APPLICATION_STAGE.SUBMISSION,
      changedBy: userId || nomination.applicant.userId,
      remarks: 'Application submitted successfully.'
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: APPLICATION_STATUS.SUBMITTED,
      currentStage: APPLICATION_STAGE.SUBMISSION,
      changedBy: userId || nomination.applicant.userId,
      role: 'CREATOR',
      remarks: 'Application submitted by user.'
    });

    await ActivityLog.create({
      user: userId || nomination.applicant.userId,
      action: 'SUBMIT_NOMINATION',
      description: `Submitted nomination with Application ID: ${nomination.applicationId}`
    });

    return nomination;
  }

  /**
   * Public Application Tracking
   */
  async trackApplication(applicationId) {
    const cleanId = String(applicationId).trim();

    const nomination = await Nomination.findOne({
      $or: [
        { applicationId: cleanId },
        ...(mongoose.Types.ObjectId.isValid(cleanId) ? [{ _id: cleanId }] : [])
      ]
    });

    if (!nomination) {
      throw new Error(`Application with ID '${applicationId}' not found.`);
    }

    const publicTimeline = nomination.timeline.map(t => ({
      status: t.status,
      stage: t.stage,
      timestamp: t.timestamp,
      remarks: t.remarks ? t.remarks.replace(/\[PRIVATE\].*/gi, '').trim() : ''
    }));

    return {
      applicationId: nomination.applicationId,
      nominationType: nomination.nominationType,
      awardType: nomination.awardType,
      applicantName: nomination.applicant.fullName,
      nomineeName: nomination.nominee?.name || nomination.applicant.fullName,
      status: nomination.status,
      currentStage: nomination.currentStage,
      submittedAt: nomination.submittedAt,
      categories: nomination.categories.map(c => ({
        categoryId: c.categoryId,
        categoryTitle: c.categoryTitle
      })),
      timeline: publicTimeline
    };
  }

  /**
   * Get drafts for logged in user
   */
  async getMyDrafts(userId, email = '') {
    const filter = {
      status: APPLICATION_STATUS.DRAFT,
      $or: [
        { 'applicant.userId': userId },
        ...(email ? [{ 'applicant.email': email }] : [])
      ]
    };

    return await Nomination.find(filter).sort('-updatedAt');
  }
}

export default new NominationService();
