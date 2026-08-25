import mongoose from 'mongoose';

const scoringBreakdownSchema = new mongoose.Schema({
  contentQuality: { type: Number, min: 0, max: 20, default: 0 },
  originality: { type: Number, min: 0, max: 15, default: 0 },
  creativity: { type: Number, min: 0, max: 15, default: 0 },
  socialImpact: { type: Number, min: 0, max: 15, default: 0 },
  audienceEngagement: { type: Number, min: 0, max: 15, default: 0 },
  consistency: { type: Number, min: 0, max: 10, default: 0 },
  accuracy: { type: Number, min: 0, max: 5, default: 0 },
  categoryAlignment: { type: Number, min: 0, max: 5, default: 0 }
}, { _id: false });

const juryReviewSchema = new mongoose.Schema(
  {
    juryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    scores: scoringBreakdownSchema,
    totalScore: { type: Number, min: 0, max: 100, required: true },
    recommendation: {
      type: String,
      enum: ['APPROVE', 'REJECT', 'SHORTLIST', 'WINNER_CANDIDATE'],
      required: true
    },
    remarks: { type: String, required: true }
  },
  { timestamps: true }
);

juryReviewSchema.index({ juryId: 1, nominationId: 1 }, { unique: true });

export const JuryReview = mongoose.model('JuryReview', juryReviewSchema);
export default JuryReview;
