import mongoose from 'mongoose';

const complianceReviewSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noAdultContent: { type: Boolean, default: true },
    noHateSpeech: { type: Boolean, default: true },
    noMisinformation: { type: Boolean, default: true },
    noViolence: { type: Boolean, default: true },
    noRepeatedPolicyViolations: { type: Boolean, default: true },
    communityGuidelinesCompliance: { type: Boolean, default: true },
    remarks: { type: String },
    result: {
      type: String,
      enum: ['BRAND_SAFE', 'REVIEW_REQUIRED', 'DISQUALIFIED'],
      required: true
    }
  },
  { timestamps: true }
);

complianceReviewSchema.index({ nominationId: 1 });

const ComplianceReview = mongoose.model('ComplianceReview', complianceReviewSchema);
export default ComplianceReview;
