const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      index: true
    },
    otp: {
      type: String,
      required: [true, 'Please provide OTP']
    },
    verified: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // TTL Index automatically removes document after expiresAt time
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Otp', otpSchema);
