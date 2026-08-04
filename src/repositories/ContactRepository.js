import ContactQuery from '../models/ContactQuery.js';

class ContactRepository {
  async create(data) {
    return await ContactQuery.create(data);
  }

  async findById(id) {
    return await ContactQuery.findById(id).populate('assignedTo', 'name email role');
  }

  async updateById(id, data) {
    return await ContactQuery.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
  }

  async findAll({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [queries, total] = await Promise.all([
      ContactQuery.find(filter).populate('assignedTo', 'name role').sort(sort).skip(skip).limit(limit).exec(),
      ContactQuery.countDocuments(filter)
    ]);
    return { queries, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new ContactRepository();
