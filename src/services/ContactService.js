import ContactRepository from '../repositories/ContactRepository.js';

class ContactService {
  async submitQuery(data) {
    return await ContactRepository.create(data);
  }

  async getAllQueries(query) {
    const { page, limit, status, type } = query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    return await ContactRepository.findAll({
      filter,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async resolveQuery(id, adminId, resolutionNotes) {
    const query = await ContactRepository.findById(id);
    if (!query) throw new Error('Contact query not found');

    query.status = 'RESOLVED';
    query.assignedTo = adminId;
    query.resolutionNotes = resolutionNotes;
    return await query.save();
  }
}

export default new ContactService();
