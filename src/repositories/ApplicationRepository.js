import Application from '../models/Application.js';

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findById(id) {
    return await Application.findById(id)
      .populate({ path: 'applicant.userId', select: 'name email phone profileImage district bio socialLinks', strictPopulate: false })
      .populate({ path: 'categories.categoryId', select: 'title slug tier prizeTier', strictPopulate: false })
      .populate({ path: 'timeline.changedBy', select: 'name role', strictPopulate: false })
      .populate({ path: 'notes.author', select: 'name role', strictPopulate: false });
  }

  async findByApplicationId(applicationId) {
    return await Application.findOne({ applicationId })
      .populate({ path: 'applicant.userId', select: 'name email phone district', strictPopulate: false })
      .populate({ path: 'categories.categoryId', select: 'title slug', strictPopulate: false });
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
        .populate({ path: 'applicant.userId', select: 'name email district profileImage', strictPopulate: false })
        .populate({ path: 'categories.categoryId', select: 'title slug tier', strictPopulate: false })
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
