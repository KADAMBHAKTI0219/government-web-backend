import Category from '../models/Category.js';

class CategoryRepository {
  async create(data) {
    return await Category.create(data);
  }

  async findById(id) {
    return await Category.findById(id);
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug });
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id);
  }

  async findAll({ filter = {}, sort = 'order createdAt' }) {
    return await Category.find(filter).sort(sort).exec();
  }
}

export default new CategoryRepository();
