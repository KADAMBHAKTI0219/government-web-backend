import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    voterIp: { type: String, required: true },
    voterUserAgent: { type: String },
    voterUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voterEmail: { type: String },
    fingerprintHash: { type: String, required: true }
  },
  { timestamps: true }
);

// Prevent duplicate votes per voter/fingerprint per application
voteSchema.index({ application: 1, fingerprintHash: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
