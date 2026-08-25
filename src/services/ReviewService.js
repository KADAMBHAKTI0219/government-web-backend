import Nomination from '../models/Nomination.js';
import Tier1Review from '../models/Tier1Review.js';
import Tier2Review from '../models/Tier2Review.js';
import Tier3Review from '../models/Tier3Review.js';
import ComplianceReview from '../models/ComplianceReview.js';
import Winner from '../models/Winner.js';
import ApplicationStatusHistory from '../models/ApplicationStatusHistory.js';
import ActivityLog from '../models/ActivityLog.js';
import { APPLICATION_STATUS, APPLICATION_STAGE } from '../constants/applicationStatuses.js';

class ReviewService {
  /**
   * 15. Eligibility Review Decision
   */
  async eligibilityReview(nominationId, { decision, remarks }, reviewerId, reviewerRole = 'ADMIN') {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const nextStatus = decision === 'ELIGIBLE' ? APPLICATION_STATUS.ELIGIBLE :
      decision === 'INELIGIBLE' ? APPLICATION_STATUS.INELIGIBLE : APPLICATION_STATUS.ELIGIBILITY_REVIEW;

    nomination.status = nextStatus;
    nomination.currentStage = APPLICATION_STAGE.ELIGIBILITY;
    nomination.timeline.push({
      status: nextStatus,
      stage: APPLICATION_STAGE.ELIGIBILITY,
      changedBy: reviewerId,
      remarks: remarks || `Eligibility decision: ${decision}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: nextStatus,
      currentStage: APPLICATION_STAGE.ELIGIBILITY,
      changedBy: reviewerId,
      role: reviewerRole,
      remarks: remarks || `Eligibility decision: ${decision}`
    });

    await ActivityLog.create({
      user: reviewerId,
      action: 'ELIGIBILITY_REVIEW',
      description: `Eligibility decision for ${nomination.applicationId}: ${decision}`
    });

    return nomination;
  }

  /**
   * 16. Preliminary Assessment Decision
   */
  async preliminaryAssessment(nominationId, { decision, remarks }, reviewerId, reviewerRole = 'ADMIN') {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const nextStatus = decision === 'PASS' ? APPLICATION_STATUS.PRELIMINARY_ASSESSMENT : APPLICATION_STATUS.NOT_SELECTED;

    nomination.status = nextStatus;
    nomination.currentStage = APPLICATION_STAGE.PRELIMINARY;
    nomination.timeline.push({
      status: nextStatus,
      stage: APPLICATION_STAGE.PRELIMINARY,
      changedBy: reviewerId,
      remarks: remarks || `Preliminary assessment: ${decision}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: nextStatus,
      currentStage: APPLICATION_STAGE.PRELIMINARY,
      changedBy: reviewerId,
      role: reviewerRole,
      remarks: remarks || `Preliminary assessment: ${decision}`
    });

    return nomination;
  }

  /**
   * 17. Shortlisting
   */
  async shortlistNomination(nominationId, { remarks }, reviewerId, reviewerRole = 'ADMIN') {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    nomination.status = APPLICATION_STATUS.SHORTLISTED;
    nomination.currentStage = APPLICATION_STAGE.SHORTLISTING;
    nomination.timeline.push({
      status: APPLICATION_STATUS.SHORTLISTED,
      stage: APPLICATION_STAGE.SHORTLISTING,
      changedBy: reviewerId,
      remarks: remarks || 'Nomination shortlisted'
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: APPLICATION_STATUS.SHORTLISTED,
      currentStage: APPLICATION_STAGE.SHORTLISTING,
      changedBy: reviewerId,
      role: reviewerRole,
      remarks: remarks || 'Nomination shortlisted'
    });

    return nomination;
  }

  /**
   * 18. Tier 1 Review Submission
   */
  async submitTier1Review(nominationId, reviewData, reviewerId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const review = await Tier1Review.create({
      nominationId,
      reviewerId,
      ...reviewData
    });

    const nextStatus = reviewData.decision === 'PASS' ? APPLICATION_STATUS.TIER_1_PASSED :
      reviewData.decision === 'FAIL' ? APPLICATION_STATUS.TIER_1_FAILED : APPLICATION_STATUS.TIER_1_SCREENING;

    nomination.status = nextStatus;
    nomination.currentStage = APPLICATION_STAGE.TIER_1;
    nomination.timeline.push({
      status: nextStatus,
      stage: APPLICATION_STAGE.TIER_1,
      changedBy: reviewerId,
      remarks: reviewData.remarks || `Tier 1 screening decision: ${reviewData.decision}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: nextStatus,
      currentStage: APPLICATION_STAGE.TIER_1,
      changedBy: reviewerId,
      role: 'REVIEWER',
      remarks: reviewData.remarks || `Tier 1 screening decision: ${reviewData.decision}`
    });

    return { review, nomination };
  }

  /**
   * 19. Tier 2 Review Submission
   */
  async submitTier2Review(nominationId, reviewData, reviewerId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const review = await Tier2Review.create({
      nominationId,
      reviewerId,
      ...reviewData
    });

    const nextStatus = reviewData.decision === 'PASS' ? APPLICATION_STATUS.TIER_2_PASSED :
      reviewData.decision === 'FAIL' ? APPLICATION_STATUS.TIER_2_FAILED : APPLICATION_STATUS.TIER_2_REVIEW;

    nomination.status = nextStatus;
    nomination.currentStage = APPLICATION_STAGE.TIER_2;
    nomination.timeline.push({
      status: nextStatus,
      stage: APPLICATION_STAGE.TIER_2,
      changedBy: reviewerId,
      remarks: reviewData.reviewerRemarks || `Tier 2 content review decision: ${reviewData.decision}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: nextStatus,
      currentStage: APPLICATION_STAGE.TIER_2,
      changedBy: reviewerId,
      role: 'REVIEWER',
      remarks: reviewData.reviewerRemarks || `Tier 2 content review decision: ${reviewData.decision}`
    });

    return { review, nomination };
  }

  /**
   * 20. Tier 3 Due Diligence Review Submission
   */
  async submitTier3Review(nominationId, reviewData, reviewerId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const review = await Tier3Review.create({
      nominationId,
      reviewerId,
      ...reviewData
    });

    const nextStatus = reviewData.decision === 'PASS' ? APPLICATION_STATUS.TIER_3_PASSED :
      reviewData.decision === 'FAIL' ? APPLICATION_STATUS.TIER_3_FAILED : APPLICATION_STATUS.TIER_3_DUE_DILIGENCE;

    nomination.status = nextStatus;
    nomination.currentStage = APPLICATION_STAGE.TIER_3;
    nomination.timeline.push({
      status: nextStatus,
      stage: APPLICATION_STAGE.TIER_3,
      changedBy: reviewerId,
      remarks: reviewData.reviewerRemarks || `Tier 3 due diligence decision: ${reviewData.decision}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: nextStatus,
      currentStage: APPLICATION_STAGE.TIER_3,
      changedBy: reviewerId,
      role: 'REVIEWER',
      remarks: reviewData.reviewerRemarks || `Tier 3 due diligence decision: ${reviewData.decision}`
    });

    return { review, nomination };
  }

  /**
   * 21. Compliance / Brand Safety Review Submission
   */
  async submitComplianceReview(nominationId, reviewData, reviewerId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const compliance = await ComplianceReview.create({
      nominationId,
      reviewerId,
      ...reviewData
    });

    return { compliance, nomination };
  }

  /**
   * 25. Declare Winner
   */
  async declareWinner(nominationId, winnerData, adminId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const winnerRecord = await Winner.create({
      nominationId: nomination._id,
      application: nomination._id,
      awardCategory: winnerData.awardCategory || nomination.categories[0]?.categoryTitle || 'General Award',
      categoryId: winnerData.categoryId || nomination.categories[0]?.categoryId,
      creatorName: winnerData.creatorName || nomination.applicant.fullName,
      creatorId: nomination.applicant.userId,
      winnerRank: winnerData.winnerRank || 'WINNER',
      position: winnerData.winnerRank || '1ST_PLACE',
      cashPrizeAwarded: winnerData.cashPrizeAwarded || 0,
      juryScore: winnerData.juryScore || nomination.averageJuryScore || 0,
      publicVoteScore: winnerData.publicVoteScore || nomination.totalVotes || 0,
      finalScore: winnerData.finalScore || 0,
      announcementDate: winnerData.announcementDate || new Date()
    });

    nomination.status = APPLICATION_STATUS.WINNER;
    nomination.currentStage = APPLICATION_STAGE.FINAL;
    nomination.timeline.push({
      status: APPLICATION_STATUS.WINNER,
      stage: APPLICATION_STAGE.FINAL,
      changedBy: adminId,
      remarks: `Declared Winner: ${winnerData.winnerRank}`
    });

    await nomination.save();

    await ApplicationStatusHistory.create({
      nominationId: nomination._id,
      applicationId: nomination.applicationId,
      status: APPLICATION_STATUS.WINNER,
      currentStage: APPLICATION_STAGE.FINAL,
      changedBy: adminId,
      role: 'ADMIN',
      remarks: `Declared Winner: ${winnerData.winnerRank}`
    });

    await ActivityLog.create({
      user: adminId,
      action: 'WINNER_DECLARED',
      description: `Declared winner for nomination ${nomination.applicationId}`
    });

    return { winner: winnerRecord, nomination };
  }
}

export default new ReviewService();
