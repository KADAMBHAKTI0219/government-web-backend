import NotificationRepository from '../repositories/NotificationRepository.js';
import { sendEmail } from '../config/mail.js';

class NotificationService {
  async createNotification(data) {
    const notification = await NotificationRepository.create(data);

    if (data.type === 'EMAIL' && data.recipientEmail) {
      await sendEmail({
        to: data.recipientEmail,
        subject: data.title,
        html: `<p>${data.message}</p>`
      });
    }

    return notification;
  }

  async broadcastAnnouncement({ title, message, link }) {
    return await NotificationRepository.create({
      title,
      message,
      link,
      type: 'ANNOUNCEMENT',
      isBroadcast: true
    });
  }

  async getUserNotifications(userId, query) {
    const { page, limit } = query;
    return await NotificationRepository.findByUser(userId, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10
    });
  }

  async markRead(id, userId) {
    return await NotificationRepository.markAsRead(id, userId);
  }
}

export default new NotificationService();
