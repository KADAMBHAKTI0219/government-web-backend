import JuryRepository from '../repositories/JuryRepository.js';
import ApplicationRepository from '../repositories/ApplicationRepository.js';
import { APPLICATION_STATUS } from '../constants/applicationStatuses.js';

class JuryService {
  async assignJury(adminId, juryId, applicationId) {
    const existing = await JuryRepository.findAssignment(juryId, applicationId);
    if (existing) {
      throw new Error('Jury is already assigned to this application');
    }

    const assignment = await JuryRepository.createAssignment({
      jury: juryId,
      application: applicationId,
      assignedBy: adminId
    });

    // Update application status to UNDER_REVIEW
    await ApplicationRepository.updateById(applicationId, { status: APPLICATION_STATUS.UNDER_REVIEW });

    return assignment;
  }

  async getJuryAssignedApplications(juryId, query) {
    const { page, limit, status } = query;
    return await JuryRepository.findJuryAssignments(juryId, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async scoreApplication(juryId, applicationId, scoreData) {
    const assignment = await JuryRepository.findAssignment(juryId, applicationId);
    if (!assignment) {
      throw new Error('You are not assigned to review this application');
    }

    const { scores, recommendation, remarks } = scoreData;
    const totalScore = scores.creativity + scores.socialImpact + scores.technicalQuality + scores.culturalRelevance;

    const juryScore = await JuryRepository.createScore({
      jury: juryId,
      application: applicationId,
      scores,
      totalScore,
      recommendation,
      remarks
    });

    // Mark assignment as completed
    assignment.status = 'COMPLETED';
    assignment.completedAt = new Date();
    await assignment.save();

    // Recalculate average score for the application
    const allScores = await JuryRepository.findScoresByApplication(applicationId);
    const avgScore = allScores.reduce((acc, curr) => acc + curr.totalScore, 0) / allScores.length;

    await ApplicationRepository.updateById(applicationId, { averageJuryScore: avgScore });

    return juryScore;
  }

  async getLeaderboard(categoryId) {
    const filter = { status: { $in: [APPLICATION_STATUS.SHORTLISTED, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.WINNER] } };
    if (categoryId) filter.category = categoryId;

    return await ApplicationRepository.findAll({
      filter,
      sort: '-averageJuryScore -totalVotes',
      limit: 20
    });
  }
}

export default new JuryService();
