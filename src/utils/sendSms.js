const axios = require('axios');

/**
 * Sends OTP via Fast2SMS API.
 * If FAST2SMS_API_KEY is not configured or fails (e.g. DLT verification required),
 * falls back to Dev/Console mode so testing is never blocked.
 */
const sendSms = async (phone, otp) => {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    console.log(`[FAST2SMS DEV MODE] SMS to ${phone}: Your OTP for Government Creator Awards Portal is ${otp}`);
    return {
      success: true,
      message: 'OTP sent successfully (Dev Mode)',
      devMode: true,
      otp
    };
  }

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        variables_values: otp,
        route: 'otp',
        numbers: phone
      },
      {
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: response.data.return || false,
      message: response.data.message || 'SMS dispatched',
      devMode: false
    };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error('Fast2SMS Error (falling back to Dev Mode):', error.response?.data || error.message);
    
    console.log(`[FAST2SMS FALLBACK DEV MODE] SMS to ${phone}: Your OTP for Government Creator Awards Portal is ${otp}`);
    return {
      success: true,
      message: `Fast2SMS Gateway Notice: ${errorMsg}. Fallback to Dev Mode.`,
      devMode: true,
      otp
    };
  }
};

module.exports = sendSms;
