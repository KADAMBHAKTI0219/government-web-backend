import { v4 as uuidv4 } from 'uuid';
import ApplicationRepository from '../repositories/ApplicationRepository.js';
import SettingsRepository from '../repositories/SettingsRepository.js';
import { APPLICATION_STATUS } from '../constants/applicationStatuses.js';

class ApplicationService {
  async createApplication(creatorId, data) {
    const settings = await SettingsRepository.getSettings();
    if (!settings.isNominationOpen) {
      throw new Error('Nomination submission window is currently closed.');
    }

    const existingCount = await ApplicationRepository.countByFilter({ creator: creatorId });
    if (existingCount >= settings.maxNominationsPerCreator) {
      throw new Error(`Maximum limit of ${settings.maxNominationsPerCreator} nominations per creator reached.`);
    }

    const applicationId = `CGAWRD-2026-${uuidv4().substring(0, 8).toUpperCase()}`;

    const applicationData = {
      ...data,
      creator: creatorId,
      applicationId,
      status: APPLICATION_STATUS.DRAFT,
      timeline: [
        {
          status: APPLICATION_STATUS.DRAFT,
          changedBy: creatorId,
          remarks: 'Nomination draft created.'
        }
      ]
    };

    return await ApplicationRepository.create(applicationData);
  }

  async submitApplication(applicationId, creatorId) {
    const app = await ApplicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.creator._id.toString() !== creatorId.toString()) {
      throw new Error('Unauthorized access to application');
    }

    if (app.status !== APPLICATION_STATUS.DRAFT) {
      throw new Error(`Application is already in ${app.status} status and cannot be resubmitted.`);
    }

    app.status = APPLICATION_STATUS.SUBMITTED;
    app.submittedAt = new Date();
    app.timeline.push({
      status: APPLICATION_STATUS.SUBMITTED,
      changedBy: creatorId,
      remarks: 'Application submitted successfully.'
    });

    return await app.save();
  }

  async updateDraft(applicationId, creatorId, updateData) {
    const app = await ApplicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.creator._id.toString() !== creatorId.toString()) {
      throw new Error('Unauthorized access to application');
    }

    if (app.status !== APPLICATION_STATUS.DRAFT) {
      throw new Error('Only draft applications can be edited');
    }

    return await ApplicationRepository.updateById(applicationId, updateData);
  }

  async deleteDraft(applicationId, creatorId) {
    const app = await ApplicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.creator._id.toString() !== creatorId.toString()) {
      throw new Error('Unauthorized access to application');
    }

    if (app.status !== APPLICATION_STATUS.DRAFT) {
      throw new Error('Only draft applications can be deleted');
    }

    return await ApplicationRepository.deleteById(applicationId);
  }

  async addMediaFile(applicationId, creatorId, fileData) {
    const app = await ApplicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');
    if (app.creator._id.toString() !== creatorId.toString()) {
      throw new Error('Unauthorized access to application');
    }

    const { fileType } = fileData;
    if (fileType === 'document') app.documents.push(fileData);
    else if (fileType === 'image') app.images.push(fileData);
    else if (fileType === 'video') app.videos.push(fileData);
    else if (fileType === 'portfolio') app.portfolio.push(fileData);

    return await app.save();
  }

  async updateStatus(applicationId, status, changedById, remarks) {
    const app = await ApplicationRepository.findById(applicationId);
    if (!app) throw new Error('Application not found');

    app.status = status;
    app.timeline.push({
      status,
      changedBy: changedById,
      remarks: remarks || `Status updated to ${status}`
    });

    return await app.save();
  }

  async getApplications(query) {
    const { page, limit, status, category, district, search } = query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (district) filter.district = district;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { applicationId: { $regex: search, $options: 'i' } }
      ];
    }

    return await ApplicationRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async getApplicationById(id) {
    const app = await ApplicationRepository.findById(id);
    if (!app) throw new Error('Application not found');
    return app;
  }
}

export default new ApplicationService();
