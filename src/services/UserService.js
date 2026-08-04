import UserRepository from '../repositories/UserRepository.js';

class UserService {
  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
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
    return await UserRepository.findAll({ filter, page: parseInt(page) || 1, limit: parseInt(limit) || 10 });
  }
}

export default new UserService();
