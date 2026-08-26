import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { sendEmail } from '../config/mail.js';
import logger from '../utils/logger.js';

class AuthService {
  async register(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    const resolvedVideoLink = userData.instagramLink || userData.videoLink || userData.instagramReelUrl || userData.reelUrl || userData.videoUrl || userData.mainVideoLink || '';

    const user = await UserRepository.create({
      ...userData,
      instagramLink: userData.instagramLink || resolvedVideoLink,
      videoLink: userData.videoLink || resolvedVideoLink,
      instagramReelUrl: userData.instagramReelUrl || resolvedVideoLink,
      isEmailVerified: true
    });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    await UserRepository.updateRefreshToken(user._id, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account deactivated. Please contact support.');
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    await UserRepository.updateRefreshToken(user._id, refreshToken);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async refreshToken(token) {
    if (!token) {
      throw new Error('Refresh token is required');
    }

    const decoded = verifyRefreshToken(token);
    const user = await UserRepository.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      throw new Error('Invalid or revoked refresh token');
    }

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    await UserRepository.updateRefreshToken(user._id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId) {
    await UserRepository.updateRefreshToken(userId, null);
    return true;
  }

  async forgotPassword(email) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Return success even if email not found for security
      return { message: 'If that email exists, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    logger.info(`🔗 [PASSWORD RESET LINK] Email: ${user.email} | Token: ${resetToken} | URL: ${resetUrl}`);

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - Chhattisgarh Creator Awards',
      html: `<p>Hello ${user.name},</p><p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a><p>Link expires in 30 minutes.</p>`
    });

    return { message: 'Password reset link sent to your email.' };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successful. You can now log in.' };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findById(userId, true);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password does not match');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}

export default new AuthService();
