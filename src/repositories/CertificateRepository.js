import Certificate from '../models/Certificate.js';
import Winner from '../models/Winner.js';

class CertificateRepository {
  async createCertificate(data) {
    return await Certificate.create(data);
  }

  async findByVerificationHash(hash) {
    return await Certificate.findOne({ verificationHash: hash })
      .populate('creator', 'name email district')
      .populate('category', 'title slug')
      .populate('application', 'applicationId title');
  }

  async findByCertificateId(certificateId) {
    return await Certificate.findOne({ certificateId })
      .populate('creator', 'name email district')
      .populate('category', 'title slug')
      .populate('application', 'applicationId title');
  }

  async findByCreator(creatorId) {
    return await Certificate.find({ creator: creatorId })
      .populate('category', 'title slug')
      .populate('application', 'applicationId title')
      .sort('-createdAt');
  }

  async createWinner(data) {
    return await Winner.create(data);
  }

  async findWinnersByCategory(categoryId) {
    return await Winner.find({ category: categoryId })
      .populate('creator', 'name email profileImage district')
      .populate('application', 'title applicationId')
      .sort('position');
  }
}

export default new CertificateRepository();
