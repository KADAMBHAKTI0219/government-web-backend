import JuryAssignment from '../models/JuryAssignment.js';
import JuryReview from '../models/JuryReview.js';
import JuryScore from '../models/JuryScore.js';
import Nomination from '../models/Nomination.js';
import ActivityLog from '../models/ActivityLog.js';
import ApplicationStatusHistory from '../models/ApplicationStatusHistory.js';
import { APPLICATION_STATUS, APPLICATION_STAGE } from '../constants/applicationStatuses.js';

class JuryService {
  /**
   * Assign jury member to nomination
   */
  async assignJury(juryId, nominationId, assignedById) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const existingAssignment = await JuryAssignment.findOne({ jury: juryId, application: nominationId });
    if (existingAssignment) {
      return existingAssignment;
    }

    const assignment = await JuryAssignment.create({
      jury: juryId,
      application: nominationId,
      assignedBy: assignedById,
      status: 'PENDING'
    });

    nomination.status = APPLICATION_STATUS.JURY_REVIEW;
    nomination.currentStage = APPLICATION_STAGE.JURY;
    await nomination.save();

    return assignment;
  }

  /**
   * Submit jury score and review across 8 criteria
   */
  async submitJuryReview(juryId, nominationId, reviewData) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const {
      scores = {},
      recommendation = 'SHORTLIST',
      remarks = ''
    } = reviewData;

    // Calculate total score out of 100
    const totalScore = (
      (scores.contentQuality || 0) +
      (scores.originality || 0) +
      (scores.creativity || 0) +
      (scores.socialImpact || 0) +
      (scores.audienceEngagement || 0) +
      (scores.consistency || 0) +
      (scores.accuracy || 0) +
      (scores.categoryAlignment || 0)
    );

    const review = await JuryReview.findOneAndUpdate(
      { juryId, nominationId },
      {
        juryId,
        nominationId,
        scores,
        totalScore,
        recommendation,
        remarks
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Keep legacy JuryScore model in sync for backward compatibility
    await JuryScore.findOneAndUpdate(
      { jury: juryId, application: nominationId },
      {
        jury: juryId,
        application: nominationId,
        scores: {
          creativity: Math.min(25, (scores.creativity || 0) + (scores.originality || 0) / 2),
          socialImpact: Math.min(25, (scores.socialImpact || 0) * 1.5),
          technicalQuality: Math.min(25, (scores.contentQuality || 0)),
          culturalRelevance: Math.min(25, (scores.categoryAlignment || 0) * 5)
        },
        totalScore,
        recommendation: recommendation === 'WINNER_CANDIDATE' ? 'APPROVE' : (recommendation || 'APPROVE'),
        remarks
      },
      { upsert: true }
    );

    // Update assignment status
    await JuryAssignment.findOneAndUpdate(
      { jury: juryId, application: nominationId },
      { status: 'COMPLETED', completedAt: new Date() }
    );

    // Update average jury score on nomination
    const allJuryReviews = await JuryReview.find({ nominationId });
    const avgScore = allJuryReviews.reduce((acc, curr) => acc + curr.totalScore, 0) / (allJuryReviews.length || 1);

    nomination.averageJuryScore = Math.round(avgScore * 100) / 100;
    await nomination.save();

    await ActivityLog.create({
      user: juryId,
      action: 'JURY_REVIEW',
      description: `Submitted jury review for nomination ${nomination.applicationId}`
    });

    return { review, averageJuryScore: nomination.averageJuryScore };
  }

  /**
   * Get assigned nominations for a jury member
   */
  async getAssignedNominations(juryId) {
    const assignments = await JuryAssignment.find({ jury: juryId }).populate('application');

    const nominations = await Promise.all(
      assignments.map(async (a) => {
        const nom = await Nomination.findById(a.application);
        const review = await JuryReview.findOne({ juryId, nominationId: a.application });

        return {
          assignmentId: a._id,
          assignmentStatus: a.status,
          assignedAt: a.assignedAt,
          nomination: nom,
          myReview: review
        };
      })
    );

    return nominations;
  }
}

export default new JuryService();
