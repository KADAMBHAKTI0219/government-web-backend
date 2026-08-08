import RecaptchaService from '../services/RecaptchaService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const verifyRecaptcha = asyncHandler(async (req, res) => {
  const captchaToken = req.body.captchaToken || req.body.captcha_token || req.body.token || req.body['g-recaptcha-response'];
  
  const result = await RecaptchaService.verifyCaptchaToken(captchaToken);

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message
  });
});
