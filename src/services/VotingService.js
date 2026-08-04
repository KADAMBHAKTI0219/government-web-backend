import crypto from 'crypto';
import VotingRepository from '../repositories/VotingRepository.js';
import ApplicationRepository from '../repositories/ApplicationRepository.js';
import SettingsRepository from '../repositories/SettingsRepository.js';

class VotingService {
  async castVote({ applicationId, voterIp, voterUserAgent, fingerprint, voterUser, voterEmail }) {
    const settings = await SettingsRepository.getSettings();
    if (!settings.isVotingEnabled) {
      throw new Error('Public voting is currently disabled.');
    }

    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    // Generate unique voter fingerprint hash
    const rawFingerprint = `${voterIp}-${voterUserAgent}-${fingerprint}-${voterEmail || ''}`;
    const fingerprintHash = crypto.createHash('sha256').update(rawFingerprint).digest('hex');

    const existingVote = await VotingRepository.findExistingVote(applicationId, fingerprintHash);
    if (existingVote) {
      throw new Error('You have already voted for this nomination.');
    }

    const vote = await VotingRepository.createVote({
      application: applicationId,
      category: application.category._id,
      voterIp,
      voterUserAgent,
      voterUser: voterUser ? voterUser._id : null,
      voterEmail,
      fingerprintHash
    });

    // Increment total vote count on application
    application.totalVotes += 1;
    await application.save();

    return vote;
  }

  async getVotingAnalytics(categoryId) {
    const leaderboard = await VotingRepository.getLeaderboard(categoryId, 10);
    const totalVotes = categoryId
      ? await VotingRepository.countVotesByCategory(categoryId)
      : await VotingRepository.countVotesByApplication({});

    return { totalVotes, leaderboard };
  }
}

export default new VotingService();
