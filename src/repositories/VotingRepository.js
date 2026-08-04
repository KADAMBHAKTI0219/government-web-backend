import Vote from '../models/Vote.js';

class VotingRepository {
  async createVote(data) {
    return await Vote.create(data);
  }

  async findExistingVote(applicationId, fingerprintHash) {
    return await Vote.findOne({ application: applicationId, fingerprintHash });
  }

  async countVotesByApplication(applicationId) {
    return await Vote.countDocuments({ application: applicationId });
  }

  async countVotesByCategory(categoryId) {
    return await Vote.countDocuments({ category: categoryId });
  }

  async getLeaderboard(categoryId, limit = 10) {
    const filter = categoryId ? { category: categoryId } : {};
    return await Vote.aggregate([
      { $match: filter },
      { $group: { _id: '$application', voteCount: { $sum: 1 } } },
      { $sort: { voteCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: '_id',
          as: 'application'
        }
      },
      { $unwind: '$application' },
      {
        $lookup: {
          from: 'users',
          localField: 'application.creator',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' },
      {
        $project: {
          _id: 1,
          voteCount: 1,
          'application.title': 1,
          'application.applicationId': 1,
          'creator.name': 1,
          'creator.profileImage': 1,
          'creator.district': 1
        }
      }
    ]);
  }
}

export default new VotingRepository();
