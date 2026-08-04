import JuryAssignment from '../models/JuryAssignment.js';
import JuryScore from '../models/JuryScore.js';

class JuryRepository {
  async createAssignment(data) {
    return await JuryAssignment.create(data);
  }

  async findAssignment(juryId, applicationId) {
    return await JuryAssignment.findOne({ jury: juryId, application: applicationId });
  }

  async findJuryAssignments(juryId, { status, page = 1, limit = 10 }) {
    const filter = { jury: juryId };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;

    const [assignments, total] = await Promise.all([
      JuryAssignment.find(filter)
        .populate({
          path: 'application',
          populate: [
            { path: 'creator', select: 'name email profileImage district bio' },
            { path: 'category', select: 'title slug' }
          ]
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .exec(),
      JuryAssignment.countDocuments(filter)
    ]);
    return { assignments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createScore(data) {
    return await JuryScore.create(data);
  }

  async findScore(juryId, applicationId) {
    return await JuryScore.findOne({ jury: juryId, application: applicationId });
  }

  async findScoresByApplication(applicationId) {
    return await JuryScore.find({ application: applicationId })
      .populate('jury', 'name email role')
      .exec();
  }
}

export default new JuryRepository();
