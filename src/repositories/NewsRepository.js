import News from '../models/News.js';

class NewsRepository {
  async create(data) {
    return await News.create(data);
  }

  async findById(id) {
    return await News.findById(id).populate('author', 'name email role');
  }

  async findBySlug(slug) {
    return await News.findOne({ slug }).populate('author', 'name email role');
  }

  async updateById(id, data) {
    return await News.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  }

  async deleteById(id) {
    return await News.findByIdAndDelete(id);
  }

  async findAll({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [newsList, total] = await Promise.all([
      News.find(filter).populate('author', 'name role').sort(sort).skip(skip).limit(limit).exec(),
      News.countDocuments(filter)
    ]);
    return { newsList, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new NewsRepository();
