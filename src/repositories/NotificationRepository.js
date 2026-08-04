import Notification from '../models/Notification.js';

class NotificationRepository {
  async create(data) {
    return await Notification.create(data);
  }

  async findByUser(userId, { page = 1, limit = 10 }) {
    const filter = {
      $or: [{ recipient: userId }, { isBroadcast: true }]
    };
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(filter).sort('-createdAt').skip(skip).limit(limit).exec(),
      Notification.countDocuments(filter)
    ]);
    return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(id, userId) {
    return await Notification.findOneAndUpdate(
      { _id: id, $or: [{ recipient: userId }, { isBroadcast: true }] },
      { isRead: true },
      { returnDocument: 'after' }
    );
  }
}

export default new NotificationRepository();
