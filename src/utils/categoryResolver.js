import CategoryService from '../services/CategoryService.js';
import mongoose from 'mongoose';

/**
 * High-performance, RAM-cached Category Resolver Utility.
 * Resolves category IDs, Slugs, or Titles with 0ms database overhead.
 */
export class CategoryResolver {
  /**
   * Resolves category input (ID string, Object with _id, slug, or title) to Category ObjectId
   * @param {any} catInput
   * @returns {Promise<mongoose.Types.ObjectId | string | null>}
   */
  static async resolveId(catInput) {
    const categories = await CategoryService.getAllCategories(false);

    if (!catInput) {
      return categories[0] ? categories[0]._id : null;
    }

    // 1. Direct ObjectId or Object with _id
    const targetId = typeof catInput === 'string' ? catInput : (catInput && catInput._id ? String(catInput._id) : null);
    if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
      const existing = categories.find(c => String(c._id) === String(targetId));
      if (existing) return existing._id;
    }

    // 2. Resolve by slug or title in RAM cache
    const strVal = String(typeof catInput === 'string' ? catInput : (catInput.title || catInput.name || catInput.slug || '')).toLowerCase().trim();
    const slugified = strVal.replace(/[^a-z0-9]+/g, '-');

    const found = categories.find(c =>
      c.slug?.toLowerCase() === strVal ||
      c.slug?.toLowerCase() === slugified ||
      c.title?.toLowerCase() === strVal
    );

    if (found) {
      return found._id;
    }

    // Fallback to default first category
    return categories[0] ? categories[0]._id : catInput;
  }

  /**
   * Resolves category input to full Category Object from RAM cache
   * @param {any} catInput
   * @returns {Promise<Object | null>}
   */
  static async resolveDetails(catInput) {
    if (!catInput) return null;
    const categories = await CategoryService.getAllCategories(false);

    const targetId = typeof catInput === 'string' ? catInput : (catInput && catInput._id ? String(catInput._id) : null);
    if (targetId && mongoose.Types.ObjectId.isValid(targetId)) {
      const existing = categories.find(c => String(c._id) === String(targetId));
      if (existing) return existing;
    }

    const strVal = String(typeof catInput === 'string' ? catInput : (catInput.title || catInput.name || catInput.slug || '')).toLowerCase().trim();
    const slugified = strVal.replace(/[^a-z0-9]+/g, '-');

    const found = categories.find(c =>
      c.slug?.toLowerCase() === strVal ||
      c.slug?.toLowerCase() === slugified ||
      c.title?.toLowerCase() === strVal
    );

    return found || categories[0] || null;
  }
}

export default CategoryResolver;
