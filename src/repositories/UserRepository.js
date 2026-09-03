import User from '../models/User.js';

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id, selectPassword = false) {
    const query = User.findById(id);
    if (selectPassword) query.select('+password');
    return await query.exec();
  }

  async findByEmail(email, selectPassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (selectPassword) {
      query.select('+password');
      return await query.exec();
    }
    return await query.lean().exec();
  }


  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });
  }

  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  async findAll({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      User.countDocuments(filter)
    ]);
    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateRefreshToken(id, refreshToken) {
    return await User.findByIdAndUpdate(id, { refreshToken }, { returnDocument: 'after' });
  }

  async findByResetToken(hashedToken) {
    return await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });
  }
}

export default new UserRepository();
