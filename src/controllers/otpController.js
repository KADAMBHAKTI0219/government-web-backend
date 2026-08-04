import Otp from '../models/Otp.js';
import { sendSms } from '../utils/sendSms.js';

export const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone is required' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await Otp.create({ phone, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  await sendSms(phone, `OTP: ${otp}`);
  res.json({ message: 'OTP sent' });
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const match = await Otp.findOne({ phone, otp });
  if (!match) return res.status(400).json({ message: 'Invalid OTP' });
  res.json({ message: 'OTP verified' });
};
