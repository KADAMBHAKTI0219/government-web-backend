import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'laxsavani4259@gmail.com';
  const pass = process.env.SMTP_PASS || 'aoaueezvmzgskbpy';

  if (host.includes('gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined
  });
};

const transporter = getTransporter();

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const fromAddress = process.env.SMTP_USER
      ? `Chhattisgarh Creator Awards <${process.env.SMTP_USER}>`
      : process.env.EMAIL_FROM || 'Chhattisgarh Awards <no-reply@cgawards.gov.in>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text,
      html
    });
    logger.info(`📧 Email sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`⚠️ Email sending failed to ${to}: ${error.message}`);
    return null;
  }
};

export default transporter;
