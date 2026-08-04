import Settings from '../models/Settings.js';

class SettingsRepository {
  async getSettings() {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  }

  async updateSettings(updateData) {
    let settings = await Settings.findOne();
    if (!settings) {
      return await Settings.create(updateData);
    }
    return await Settings.findByIdAndUpdate(settings._id, updateData, { returnDocument: 'after' });
  }
}

export default new SettingsRepository();
