import mongoose from 'mongoose';
import { APPLICATION_STATUS } from '../constants/applicationStatuses.js';

const mediaFileSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['document', 'image', 'video', 'portfolio'], required: true },
  fileName: { type: String },
  fileSize: { type: Number },
  cloudinaryPublicId: { type: String }
}, { _id: true });

const timelineSchema = new mongoose.Schema({
  status: { type: String, enum: Object.values(APPLICATION_STATUS), required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const applicationNoteSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true }, // Format e.g., CGAWRD-2026-XXXX
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true, trim: true },
    workSummary: { type: String, required: true },
    contentUrl: { type: String, required: true },
    impactDescription: { type: String },
    district: { type: String, required: true },

    documents: [mediaFileSchema],
    images: [mediaFileSchema],
    videos: [mediaFileSchema],
    portfolio: [mediaFileSchema],

    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.DRAFT
    },

    timeline: [timelineSchema],
    notes: [applicationNoteSchema],

    submittedAt: { type: Date },
    totalVotes: { type: Number, default: 0 },
    averageJuryScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
