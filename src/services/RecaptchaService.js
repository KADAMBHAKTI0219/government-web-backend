import CaptchaService from './CaptchaService.js';

class RecaptchaService {
  /**
   * Verifies Google reCAPTCHA token against Google's siteverify API.
   * Maintains backward compatibility.
   * @param {string} captchaToken - The token sent from the frontend client.
   * @returns {Promise<{success: boolean, statusCode: number, message: string}>}
   */
  async verifyCaptchaToken(captchaToken) {
    return await CaptchaService.verifyGoogleRecaptcha(captchaToken);
  }
}

export default new RecaptchaService();
