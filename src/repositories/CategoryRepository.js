import Category from '../models/Category.js';

class CategoryRepository {
  async create(data) {
    const doc = await Category.create(data);
    return doc.toObject();
  }

  async findById(id) {
    return await Category.findById(id).lean().exec();
  }

  async findBySlug(slug) {
    return await Category.findOne({ slug }).lean().exec();
  }

  async updateById(id, updateData) {
    return await Category.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true }).lean().exec();
  }

  async deleteById(id) {
    return await Category.findByIdAndDelete(id).lean().exec();
  }

  async findAll({ filter = {}, sort = { categoryNumber: 1, tierNumber: 1, order: 1 }, select = null } = {}) {
    let query = Category.find(filter).sort(sort);
    if (select) {
      query = query.select(select);
    }
    return await query.lean().exec();
  }
}

export default new CategoryRepository();

