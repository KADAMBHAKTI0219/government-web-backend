import slugify from 'slugify';
import CategoryRepository from '../repositories/CategoryRepository.js';

class CategoryService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL
  }

  _isCacheValid(key) {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_TTL_MS;
  }

  _setCache(key, data) {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
  }

  async createCategory(data) {
    const slug = slugify(data.title, { lower: true, strict: true });
    const existing = await CategoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error('A category with this title already exists');
    }

    const created = await CategoryRepository.create({ ...data, slug });
    this.clearCache();
    return created;
  }

  async getAllCategories(includeInactive = false, select = null) {
    const cacheKey = `categories_${includeInactive ? 'all' : 'active'}_${select || 'full'}`;
    if (this._isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const filter = includeInactive ? {} : { isActive: true };
    const categories = await CategoryRepository.findAll({ filter, select });
    this._setCache(cacheKey, categories);
    return categories;
  }

  async getCategoryBySlug(slug) {
    const cacheKey = `category_slug_${slug}`;
    if (this._isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new Error('Category not found');
    this._setCache(cacheKey, category);
    return category;
  }

  async updateCategory(id, data) {
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
    const updated = await CategoryRepository.updateById(id, data);
    if (!updated) throw new Error('Category not found for update');
    this.clearCache();
    return updated;
  }

  async deleteCategory(id) {
    const deleted = await CategoryRepository.deleteById(id);
    if (!deleted) throw new Error('Category not found for deletion');
    this.clearCache();
    return true;
  }
}

export default new CategoryService();

