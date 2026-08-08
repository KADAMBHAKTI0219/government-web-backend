import CaptchaService from '../services/CaptchaService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Generate a visual SVG CAPTCHA
 * GET /api/v1/captcha/generate
 */
export const generateCaptcha = asyncHandler(async (req, res) => {
  const options = {
    width: req.query.width,
    height: req.query.height,
    size: req.query.size
  };

  const captchaData = CaptchaService.generateSvgCaptcha(options);

  return res.status(200).json({
    success: true,
    message: 'Captcha generated successfully.',
    data: captchaData
  });
});

/**
 * Verify a CAPTCHA (SVG or Google reCAPTCHA)
 * POST /api/v1/captcha/verify
 */
export const verifyCaptcha = asyncHandler(async (req, res) => {
  const captchaId = req.body.captchaId || req.body.captcha_id;
  const captchaText = req.body.captchaText || req.body.captcha_text || req.body.captchaCode || req.body.captcha_code;
  const captchaToken = req.body.captchaToken || req.body.captcha_token || req.body.token || req.body['g-recaptcha-response'];

  const result = await CaptchaService.verifyAnyCaptcha({
    captchaId,
    captchaText,
    captchaToken
  });

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message
  });
});
