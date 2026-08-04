import CMSRepository from '../repositories/CMSRepository.js';

class CMSService {
  async getCMSSection(key) {
    const section = await CMSRepository.getByKey(key);
    if (!section) throw new Error(`CMS section for '${key}' not found`);
    return section;
  }

  async updateCMSSection(key, userId, data) {
    return await CMSRepository.upsertByKey(key, {
      ...data,
      key,
      lastUpdatedBy: userId
    });
  }

  async getAllCMS() {
    return await CMSRepository.getAllSections();
  }
}

export default new CMSService();
