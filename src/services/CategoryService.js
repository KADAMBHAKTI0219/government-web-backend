import slugify from 'slugify';
import CategoryRepository from '../repositories/CategoryRepository.js';

class CategoryService {
  async createCategory(data) {
    const slug = slugify(data.title, { lower: true, strict: true });
    const existing = await CategoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error('A category with this title already exists');
    }

    return await CategoryRepository.create({ ...data, slug });
  }

  async getAllCategories(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return await CategoryRepository.findAll({ filter });
  }

  async getCategoryBySlug(slug) {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async updateCategory(id, data) {
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
    const updated = await CategoryRepository.updateById(id, data);
    if (!updated) throw new Error('Category not found for update');
    return updated;
  }

  async deleteCategory(id) {
    const deleted = await CategoryRepository.deleteById(id);
    if (!deleted) throw new Error('Category not found for deletion');
    return true;
  }
}

export default new CategoryService();
