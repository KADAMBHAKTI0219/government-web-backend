import mongoose from 'mongoose';

const tier2ReviewSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Content Safety Checks (true if violation found)
    adultContent: { type: Boolean, default: false },
    nudity: { type: Boolean, default: false },
    violence: { type: Boolean, default: false },
    harmfulActivities: { type: Boolean, default: false },
    hateSpeech: { type: Boolean, default: false },
    misinformation: { type: Boolean, default: false },
    offensiveContent: { type: Boolean, default: false },
    communityViolation: { type: Boolean, default: false },

    // Content Quality Evaluation (Scores 1-10)
    contentQuality: { type: Number, min: 1, max: 10, default: 8 },
    originality: { type: Number, min: 1, max: 10, default: 8 },
    educationalValue: { type: Number, min: 1, max: 10, default: 8 },
    socialImpact: { type: Number, min: 1, max: 10, default: 8 },
    storytelling: { type: Number, min: 1, max: 10, default: 8 },
    productionQuality: { type: Number, min: 1, max: 10, default: 8 },
    informationAccuracy: { type: Number, min: 1, max: 10, default: 8 },

    // Fact Check
    factCheckRequired: { type: Boolean, default: false },
    factCheckResult: { type: String, default: 'VERIFIED' },

    reviewerRemarks: { type: String },
    decision: { type: String, enum: ['PASS', 'FAIL', 'NEEDS_REVIEW'], required: true }
  },
  { timestamps: true }
);

tier2ReviewSchema.index({ nominationId: 1, reviewerId: 1 });

const Tier2Review = mongoose.model('Tier2Review', tier2ReviewSchema);
export default Tier2Review;
