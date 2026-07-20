const Otp = require('../models/Otp');
const sendSms = require('../utils/sendSms');

// @desc    Send OTP to phone
// @route   POST /api/otp/send
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
    }

    const cleanPhone = phone.trim();

    // Generate 6-digit random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Delete existing OTP entries for this phone number
    await Otp.deleteMany({ phone: cleanPhone });

    // Create new OTP record
    await Otp.create({
      phone: cleanPhone,
      otp: generatedOtp,
      expiresAt,
      verified: false
    });

    // Send SMS via Fast2SMS / Dev fallback
    const smsResult = await sendSms(cleanPhone, generatedOtp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      devMode: smsResult.devMode || false,
      // Pass OTP in dev/testing mode when Fast2SMS key is absent
      ...(smsResult.devMode ? { devOtp: generatedOtp } : {})
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and OTP'
      });
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    const otpRecord = await Otp.findOne({ phone: cleanPhone });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new OTP.'
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (otpRecord.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.'
      });
    }

    // Mark OTP record as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      phone: cleanPhone,
      otpVerified: true
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};
