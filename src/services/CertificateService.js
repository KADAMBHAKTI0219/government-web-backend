import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import CertificateRepository from '../repositories/CertificateRepository.js';
import ApplicationRepository from '../repositories/ApplicationRepository.js';
import { generateQRCodeDataURI } from '../utils/qrCode.js';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CertificateService {
  async generateCertificate({ applicationId, awardTitle, position }) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) throw new Error('Application not found');

    const certificateId = `CERT-CG-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${certificateId}-${application._id}-${Date.now()}`)
      .digest('hex');

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-certificate?hash=${verificationHash}`;
    const qrCodeDataURI = await generateQRCodeDataURI(verifyUrl);

    const fileName = `${certificateId}.pdf`;
    const certDir = path.join(__dirname, '../../uploads/certificates');
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

    const outputPath = path.join(certDir, fileName);

    await generateCertificatePDF({
      certificateId,
      creatorName: application.creator.name,
      awardTitle: awardTitle || 'State Creator Award 2026',
      categoryTitle: application.category.title,
      issuedDate: new Date(),
      qrCodeDataURI,
      outputPath
    });

    const pdfUrl = `/uploads/certificates/${fileName}`;

    const certificate = await CertificateRepository.createCertificate({
      certificateId,
      application: applicationId,
      creator: application.creator._id,
      category: application.category._id,
      awardTitle: awardTitle || 'State Creator Award 2026',
      pdfUrl,
      qrCodeUrl: qrCodeDataURI,
      verificationHash
    });

    if (position) {
      await CertificateRepository.createWinner({
        category: application.category._id,
        application: applicationId,
        creator: application.creator._id,
        position,
        cashPrizeAwarded: application.category.cashPrizeMax || 50000
      });
    }

    return certificate;
  }

  async verifyCertificate(hash) {
    const cert = await CertificateRepository.findByVerificationHash(hash);
    if (!cert) throw new Error('Certificate verification failed. Invalid or forged certificate.');
    return cert;
  }

  async getCreatorCertificates(creatorId) {
    return await CertificateRepository.findByCreator(creatorId);
  }
}

export default new CertificateService();
