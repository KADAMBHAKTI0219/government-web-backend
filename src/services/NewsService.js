import slugify from 'slugify';
import NewsRepository from '../repositories/NewsRepository.js';

class NewsService {
  async createNews(authorId, data) {
    const slug = slugify(data.title, { lower: true, strict: true });
    return await NewsRepository.create({ ...data, slug, author: authorId });
  }

  async getAllNews(query) {
    const { page, limit, status, tag, isFeatured } = query;
    const filter = {};
    if (status) filter.status = status;
    else filter.status = 'PUBLISHED'; // default to published for public

    if (tag) filter.tags = tag;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    return await NewsRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async getNewsBySlug(slug) {
    const news = await NewsRepository.findBySlug(slug);
    if (!news) throw new Error('News article not found');
    return news;
  }

  async updateNews(id, data) {
    if (data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }
    return await NewsRepository.updateById(id, data);
  }

  async deleteNews(id) {
    return await NewsRepository.deleteById(id);
  }
}

export default new NewsService();
