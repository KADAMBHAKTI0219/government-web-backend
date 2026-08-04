import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true }, // Format e.g., CERT-CG-2026-XXXX
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    awardTitle: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
    pdfUrl: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    verificationHash: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
