import Certificate from '../models/Certificate.js';
import Nomination from '../models/Nomination.js';
import Winner from '../models/Winner.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CertificateService {
  /**
   * Generate Certificate Record and PDF for Winner
   */
  async generateCertificate(nominationId) {
    const nomination = await Nomination.findById(nominationId);
    if (!nomination) throw new Error('Nomination not found');

    const winner = await Winner.findOne({ nominationId: nomination._id });
    const creatorName = nomination.applicant.fullName;
    const categoryTitle = winner?.awardCategory || nomination.categories[0]?.categoryTitle || 'State Creator Award';
    const currentYear = new Date().getFullYear();

    const certificateId = `CERT-CG-${currentYear}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const verificationHash = crypto.createHash('sha256').update(`${certificateId}-${nomination.applicationId}`).digest('hex');

    const verificationUrl = `${process.env.FRONTEND_URL || 'https://cgawards.gov.in'}/verify-certificate/${certificateId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

    // Save Certificate record
    const certificate = await Certificate.create({
      certificateId,
      application: nomination._id,
      creator: nomination.applicant.userId || nomination._id,
      category: nomination.categories[0]?.categoryId || nomination._id,
      awardTitle: `Chhattisgarh State Creator & Influencer Award - ${categoryTitle}`,
      issuedDate: new Date(),
      pdfUrl: `/api/v1/certificates/${certificateId}/download`,
      qrCodeUrl: qrCodeDataUrl,
      verificationHash
    });

    return certificate;
  }

  /**
   * Generate PDF Document buffer using PDFKit and QR Code
   */
  async buildCertificatePDFBuffer(certificateId) {
    const cert = await Certificate.findOne({ certificateId }).populate('application');
    if (!cert) throw new Error('Certificate not found');

    const nomination = await Nomination.findById(cert.application);
    const creatorName = nomination?.applicant?.fullName || 'Award Winner';
    const awardTitle = cert.awardTitle;
    const applicationId = nomination?.applicationId || cert.certificateId;
    const year = new Date(cert.issuedDate).getFullYear();

    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 40 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));

    // Certificate Background & Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(4).stroke('#d97706');
    doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56).lineWidth(1).stroke('#92400e');

    // Header
    doc.fontSize(24).fillColor('#1e3a8a').text('GOVERNMENT OF CHHATTISGARH', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(28).fillColor('#b45309').text('STATE CREATOR & INFLUENCER AWARDS', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor('#4b5563').text('CERTIFICATE OF EXCELLENCE', { align: 'center' });

    doc.moveDown(1);
    doc.fontSize(16).fillColor('#1f2937').text('This is to proudly certify that', { align: 'center' });
    doc.moveDown(0.5);

    // Winner Name
    doc.fontSize(30).fillColor('#1d4ed8').text(creatorName, { align: 'center', underline: true });
    doc.moveDown(0.8);

    // Category & Citation
    doc.fontSize(15).fillColor('#374151').text(`has been conferred with the prestigious award in category:`, { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(20).fillColor('#047857').text(awardTitle, { align: 'center' });
    doc.moveDown(0.8);

    doc.fontSize(12).fillColor('#6b7280').text(`Year: ${year}  |  Application ID: ${applicationId}  |  Certificate ID: ${certificateId}`, { align: 'center' });

    // Embed Verification QR Code if available
    try {
      const qrData = cert.qrCodeUrl.replace(/^data:image\/png;base64,/, '');
      const qrBuffer = Buffer.from(qrData, 'base64');
      doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 150, { width: 90, height: 90 });
    } catch (e) {
      console.warn('QR embed warning:', e.message);
    }

    doc.fontSize(10).fillColor('#6b7280').text('Scan QR Code to Verify Authenticity', doc.page.width - 230, doc.page.height - 50);

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);
    });
  }

  /**
   * Verify Certificate by Certificate ID
   */
  async verifyCertificate(certificateId) {
    const cert = await Certificate.findOne({ certificateId }).populate('application');
    if (!cert) {
      return { isValid: false, message: 'Certificate not found or invalid' };
    }

    const nomination = await Nomination.findById(cert.application);

    return {
      isValid: true,
      certificateId: cert.certificateId,
      creatorName: nomination?.applicant?.fullName || 'Winner',
      awardTitle: cert.awardTitle,
      applicationId: nomination?.applicationId,
      issuedDate: cert.issuedDate,
      verificationHash: cert.verificationHash
    };
  }
}

export default new CertificateService();
