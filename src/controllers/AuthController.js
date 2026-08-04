import AuthService from '../services/AuthService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { setAuthCookies, clearAuthCookies } from '../utils/token.js';

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  return ApiResponse.success(res, 'User registered successfully. Verification OTP sent.', result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  return ApiResponse.success(res, 'Login successful', result, 200);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await AuthService.refreshToken(token);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  return ApiResponse.success(res, 'Token refreshed successfully', result, 200);
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await AuthService.logout(req.user._id);
  }
  clearAuthCookies(res);
  return ApiResponse.success(res, 'Logout successful', {}, 200);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyEmail(email, otp);
  return ApiResponse.success(res, result.message, {}, 200);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  return ApiResponse.success(res, result.message, {}, 200);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await AuthService.resetPassword(token, newPassword);
  return ApiResponse.success(res, result.message, {}, 200);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);
  return ApiResponse.success(res, result.message, {}, 200);
});
