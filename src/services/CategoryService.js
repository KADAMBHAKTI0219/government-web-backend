import slugify from 'slugify';
import CategoryRepository from '../repositories/CategoryRepository.js';
import logger from '../utils/logger.js';

class CategoryService {
  constructor() {
    this.cache = new Map();
    this.cacheTimestamps = new Map();
    this.CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL for RAM cache
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

  /**
   * Preload category cache on server boot for instant 0ms responses
   */
  async preloadCache() {
    try {
      const allCategories = await CategoryRepository.findAll({ filter: {} });
      const activeCategories = allCategories.filter(c => c.isActive !== false);

      this._setCache('categories_all_full', allCategories);
      this._setCache('categories_active_full', activeCategories);

      // Pre-warm slug cache
      for (const cat of allCategories) {
        if (cat.slug) {
          this._setCache(`category_slug_${cat.slug}`, cat);
        }
      }

      logger.info(`Category RAM Cache pre-warmed successfully (${activeCategories.length} active / ${allCategories.length} total categories loaded).`);
    } catch (error) {
      logger.error(`Failed to preload category cache: ${error.message}`);
    }
  }

  /**
   * Project requested fields from cached full objects in memory (0ms DB cost)
   */
  _projectFields(categories, selectStr) {
    if (!selectStr || typeof selectStr !== 'string') return categories;

    const fields = selectStr.split(/\s+/).filter(Boolean);
    if (fields.length === 0) return categories;

    return categories.map(cat => {
      const projected = { _id: cat._id };
      for (const field of fields) {
        if (field in cat) {
          projected[field] = cat[field];
        }
      }
      return projected;
    });
  }

  async createCategory(data) {
    const slug = slugify(data.title, { lower: true, strict: true });
    const existing = await CategoryRepository.findBySlug(slug);
    if (existing) {
      throw new Error('A category with this title already exists');
    }

    const created = await CategoryRepository.create({ ...data, slug });
    this.clearCache();
    await this.preloadCache();
    return created;
  }

  async getAllCategories(includeInactive = false, select = null) {
    const fullCacheKey = `categories_${includeInactive ? 'all' : 'active'}_full`;

    let baseCategories;
    if (this._isCacheValid(fullCacheKey)) {
      baseCategories = this.cache.get(fullCacheKey);
    } else {
      const filter = includeInactive ? {} : { isActive: true };
      baseCategories = await CategoryRepository.findAll({ filter });
      this._setCache(fullCacheKey, baseCategories);
    }

    if (select) {
      return this._projectFields(baseCategories, select);
    }

    return baseCategories;
  }

  async getCategoryBySlug(slug) {
    const cacheKey = `category_slug_${slug}`;
    if (this._isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Try finding in pre-cached active categories first
    const activeCategories = this.cache.get('categories_active_full');
    if (activeCategories) {
      const foundInCache = activeCategories.find(c => c.slug === slug);
      if (foundInCache) {
        this._setCache(cacheKey, foundInCache);
        return foundInCache;
      }
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
    await this.preloadCache();
    return updated;
  }

  async deleteCategory(id) {
    const deleted = await CategoryRepository.deleteById(id);
    if (!deleted) throw new Error('Category not found for deletion');
    this.clearCache();
    await this.preloadCache();
    return true;
  }
}

export default new CategoryService();
