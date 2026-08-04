import slugify from 'slugify';
import GalleryRepository from '../repositories/GalleryRepository.js';

class GalleryService {
  async createAlbum(data) {
    const slug = slugify(data.albumName, { lower: true, strict: true });
    return await GalleryRepository.create({ ...data, slug });
  }

  async addMediaToAlbum(albumId, mediaItems) {
    const album = await GalleryRepository.findById(albumId);
    if (!album) throw new Error('Gallery album not found');

    album.media.push(...mediaItems);
    return await album.save();
  }

  async getAlbums(query) {
    const { page, limit, isFeatured } = query;
    const filter = { isActive: true };
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';

    return await GalleryRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async getAlbumBySlug(slug) {
    const album = await GalleryRepository.findBySlug(slug);
    if (!album) throw new Error('Gallery album not found');
    return album;
  }

  async deleteAlbum(id) {
    return await GalleryRepository.deleteById(id);
  }
}

export default new GalleryService();
