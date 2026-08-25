import Vote from '../models/Vote.js';
import Nomination from '../models/Nomination.js';
import Category from '../models/Category.js';
import Settings from '../models/Settings.js';
import crypto from 'crypto';

class VotingService {
  /**
   * Cast a public vote for a nomination
   */
  async castVote(nominationId, voterData) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const settings = await Settings.findOne() || {};
    if (settings.isVotingOpen === false) {
      throw new Error('Public voting is currently closed.');
    }

    const { voterIp = '127.0.0.1', voterUserAgent = '', voterEmail = '', voterPhone = '', voterUser = null } = voterData;

    // Create unique fingerprint based on IP + Email/Phone/UserAgent
    const fingerprintRaw = `${voterIp}-${voterEmail}-${voterPhone}-${voterUserAgent}`;
    const fingerprintHash = crypto.createHash('sha256').update(fingerprintRaw).digest('hex');

    // Duplicate vote check
    const existingVote = await Vote.findOne({
      application: nomination._id,
      $or: [
        { fingerprintHash },
        ...(voterEmail ? [{ voterEmail }] : []),
        ...(voterUser ? [{ voterUser }] : [])
      ]
    });

    if (existingVote) {
      throw new Error('You have already voted for this nomination.');
    }

    const firstCatId = nomination.categories[0]?.categoryId;

    const vote = await Vote.create({
      application: nomination._id,
      category: firstCatId || nomination._id,
      voterIp,
      voterUserAgent,
      voterUser,
      voterEmail,
      fingerprintHash
    });

    // Increment vote count on nomination in MongoDB
    nomination.totalVotes += 1;
    await nomination.save();

    return { success: true, message: 'Vote recorded successfully', totalVotes: nomination.totalVotes };
  }

  /**
   * Get voting leaderboard
   */
  async getLeaderboard(categoryId = null) {
    const filter = categoryId ? { 'categories.categoryId': categoryId } : {};

    const nominations = await Nomination.find(filter)
      .select('applicationId applicant nominee categories totalVotes averageJuryScore status')
      .sort('-totalVotes')
      .limit(50);

    return nominations;
  }
}

export default new VotingService();
