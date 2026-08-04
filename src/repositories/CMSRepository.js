import CMS from '../models/CMS.js';

class CMSRepository {
  async getByKey(key) {
    return await CMS.findOne({ key }).populate('lastUpdatedBy', 'name role');
  }

  async upsertByKey(key, data) {
    return await CMS.findOneAndUpdate({ key }, data, { returnDocument: 'after', upsert: true, runValidators: true });
  }

  async getAllSections() {
    return await CMS.find().populate('lastUpdatedBy', 'name role');
  }
}

export default new CMSRepository();
