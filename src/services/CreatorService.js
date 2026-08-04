import UserRepository from '../repositories/UserRepository.js';
import ApplicationRepository from '../repositories/ApplicationRepository.js';

class CreatorService {
  async updateSocialLinks(creatorId, socialLinks) {
    return await UserRepository.updateById(creatorId, { socialLinks });
  }

  async updateAchievements(creatorId, achievements) {
    return await UserRepository.updateById(creatorId, { achievements });
  }

  async uploadPortfolio(creatorId, portfolioUrl) {
    return await UserRepository.updateById(creatorId, { portfolioUrl });
  }

  async getCreatorDashboard(creatorId) {
    const creator = await UserRepository.findById(creatorId);
    const applications = await ApplicationRepository.findAll({
      filter: { creator: creatorId },
      limit: 50
    });

    return {
      profile: creator,
      applications: applications.applications,
      totalApplications: applications.total
    };
  }
}

export default new CreatorService();
