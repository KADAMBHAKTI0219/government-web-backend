import UserRepository from '../repositories/UserRepository.js';
import Participant from '../models/Participant.js';
import { deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import logger from '../utils/logger.js';

class UserService {
  async getProfile(userId) {
    let user = await UserRepository.findById(userId);
    if (!user) {
      const part = await Participant.findById(userId);
      if (part) {
        user = {
          _id: part._id,
          id: part._id,
          name: part.name || part.fullName,
          fullName: part.fullName || part.name,
          email: part.email || '',
          phone: part.phone || '',
          role: 'CREATOR',
          district: part.district || 'Raipur',
          state: part.state || 'Chhattisgarh',
          isActive: part.status !== 'REJECTED',
          isProfileComplete: true
        };
      }
    }
    if (!user) throw new Error('User profile not found');
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await UserRepository.updateById(userId, updateData);
    if (!user) throw new Error('User profile update failed');

    // Auto mark profile complete if required fields exist
    if (user.name && user.district && user.bio && user.socialLinks && user.socialLinks.length > 0) {
      user.isProfileComplete = true;
      await user.save();
    }

    return user;
  }

  async uploadProfileImage(userId, imageUrl) {
    const existingUser = await UserRepository.findById(userId);
    if (existingUser && existingUser.profileImage && existingUser.profileImage !== imageUrl) {
      deleteFromCloudinary(existingUser.profileImage).catch(err => {
        logger.error('Failed to cleanup old profile image from Cloudinary:', err);
      });
    }
    return await UserRepository.updateById(userId, { profileImage: imageUrl });
  }

  async deleteAccount(userId) {
    return await UserRepository.deleteById(userId);
  }

  async getAllUsers(query) {
    const { page, limit, role, district, search } = query;
    const filter = {};
    if (role) filter.role = role;
    if (district) filter.district = district;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const userResult = await UserRepository.findAll({ filter, page: parseInt(page) || 1, limit: parseInt(limit) || 10 });

    if (!userResult.users || userResult.users.length === 0) {
      const partFilter = {};
      if (district) partFilter.district = district;
      if (search) {
        partFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      const [participants, total] = await Promise.all([
        Participant.find(partFilter).sort('-createdAt').skip(skip).limit(limitNum).exec(),
        Participant.countDocuments(partFilter)
      ]);

      if (participants.length > 0) {
        return {
          users: participants,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        };
      }
    }

    return userResult;
  }
}

export default new UserService();
