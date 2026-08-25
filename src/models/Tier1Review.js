import mongoose from 'mongoose';

const tier1ReviewSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followerAuthenticity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW', 'SUSPICIOUS'], default: 'HIGH' },
    engagementQuality: { type: String, enum: ['EXCELLENT', 'GOOD', 'AVERAGE', 'POOR'], default: 'GOOD' },
    audienceGrowth: { type: String, enum: ['ORGANIC', 'STABLE', 'IRREGULAR', 'SUSPICIOUS'], default: 'ORGANIC' },
    contentConsistency: { type: String, enum: ['HIGH', 'MODERATE', 'LOW'], default: 'HIGH' },
    accountAuthenticity: { type: Boolean, default: true },
    botActivity: { type: Boolean, default: false },
    engagementManipulation: { type: Boolean, default: false },
    categoryAlignment: { type: Boolean, default: true },
    riskFlag: { type: Boolean, default: false },
    remarks: { type: String },
    decision: { type: String, enum: ['PASS', 'FAIL', 'NEEDS_REVIEW'], required: true }
  },
  { timestamps: true }
);

tier1ReviewSchema.index({ nominationId: 1, reviewerId: 1 });

const Tier1Review = mongoose.model('Tier1Review', tier1ReviewSchema);
export default Tier1Review;
