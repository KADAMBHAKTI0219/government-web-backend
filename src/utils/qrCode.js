import QRCode from 'qrcode';

export const generateQRCodeDataURI = async (text) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 250
    });
  } catch (err) {
    throw new Error(`QR Code generation failed: ${err.message}`);
  }
};
