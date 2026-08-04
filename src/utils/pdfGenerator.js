import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificatePDF = ({
  certificateId,
  creatorName,
  awardTitle,
  categoryTitle,
  issuedDate,
  qrCodeDataURI,
  outputPath
}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 40
    });

    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(5)
      .strokeColor('#B8860B') // Golden color border
      .stroke();

    doc
      .rect(28, 28, doc.page.width - 56, doc.page.height - 56)
      .lineWidth(1)
      .strokeColor('#003366') // Deep Navy border
      .stroke();

    // Header
    doc
      .fillColor('#003366')
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('GOVERNMENT OF CHHATTISGARH', { align: 'center' });

    doc
      .fillColor('#B8860B')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('STATE CREATOR & INFLUENCER AWARDS 2026', { align: 'center' });

    doc.moveDown(1.5);

    doc
      .fillColor('#333333')
      .fontSize(14)
      .font('Helvetica')
      .text('CERTIFICATE OF EXCELLENCE', { align: 'center' });

    doc.moveDown(0.8);

    doc
      .fontSize(12)
      .text('This is proudly presented to', { align: 'center' });

    doc.moveDown(0.5);

    // Winner Name
    doc
      .fillColor('#003366')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text(creatorName.toUpperCase(), { align: 'center' });

    doc.moveDown(0.5);

    doc
      .fillColor('#333333')
      .fontSize(12)
      .font('Helvetica')
      .text(
        `In recognition of outstanding digital creation and creative contribution in the category of`,
        { align: 'center' }
      );

    doc.moveDown(0.3);

    doc
      .fillColor('#B8860B')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(`"${categoryTitle}"`, { align: 'center' });

    doc.moveDown(0.3);

    doc
      .fillColor('#333333')
      .fontSize(12)
      .font('Helvetica')
      .text(`Award Title: ${awardTitle}`, { align: 'center' });

    doc.moveDown(1.5);

    // Footer - Certificate ID & QR
    doc
      .fontSize(10)
      .fillColor('#555555')
      .text(`Certificate ID: ${certificateId}`, 50, doc.page.height - 90);

    doc
      .text(`Issued Date: ${new Date(issuedDate).toLocaleDateString()}`, 50, doc.page.height - 75);

    if (qrCodeDataURI) {
      const base64Data = qrCodeDataURI.replace(/^data:image\/png;base64,/, '');
      const qrPath = path.join(__dirname, `temp_qr_${Date.now()}.png`);
      fs.writeFileSync(qrPath, base64Data, 'base64');

      doc.image(qrPath, doc.page.width - 130, doc.page.height - 130, { width: 80 });

      writeStream.on('finish', () => {
        if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);
        resolve(outputPath);
      });
    } else {
      writeStream.on('finish', () => resolve(outputPath));
    }

    writeStream.on('error', (err) => reject(err));

    doc.end();
  });
};
