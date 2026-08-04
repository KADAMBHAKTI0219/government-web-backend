import Application from '../models/Application.js';

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findById(id) {
    return await Application.findById(id)
      .populate('creator', 'name email phone profileImage district bio socialLinks')
      .populate('category', 'title slug tier prizeTier')
      .populate('timeline.changedBy', 'name role')
      .populate('notes.author', 'name role');
  }

  async findByApplicationId(applicationId) {
    return await Application.findOne({ applicationId })
      .populate('creator', 'name email phone district')
      .populate('category', 'title slug');
  }

  async updateById(id, updateData) {
    return await Application.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
  }

  async deleteById(id) {
    return await Application.findByIdAndDelete(id);
  }

  async findAll({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('creator', 'name email district profileImage')
        .populate('category', 'title slug tier')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Application.countDocuments(filter)
    ]);
    return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async countByFilter(filter = {}) {
    return await Application.countDocuments(filter);
  }
}

export default new ApplicationRepository();
