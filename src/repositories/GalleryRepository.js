import Gallery from '../models/Gallery.js';

class GalleryRepository {
  async create(data) {
    return await Gallery.create(data);
  }

  async findById(id) {
    return await Gallery.findById(id);
  }

  async findBySlug(slug) {
    return await Gallery.findOne({ slug });
  }

  async updateById(id, data) {
    return await Gallery.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  }

  async deleteById(id) {
    return await Gallery.findByIdAndDelete(id);
  }

  async findAll({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [albums, total] = await Promise.all([
      Gallery.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      Gallery.countDocuments(filter)
    ]);
    return { albums, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new GalleryRepository();
