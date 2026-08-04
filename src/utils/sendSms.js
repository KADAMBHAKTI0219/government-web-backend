import axios from 'axios';

export const sendSms = async (phone, message) => {
  console.log(`Sending SMS to ${phone}: ${message}`);
  return true;
};
