import mongoose from 'mongoose';

const scoreCriteriaSchema = new mongoose.Schema({
  creativity: { type: Number, min: 0, max: 25, required: true },
  socialImpact: { type: Number, min: 0, max: 25, required: true },
  technicalQuality: { type: Number, min: 0, max: 25, required: true },
  culturalRelevance: { type: Number, min: 0, max: 25, required: true }
}, { _id: false });

const juryScoreSchema = new mongoose.Schema(
  {
    jury: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    scores: scoreCriteriaSchema,
    totalScore: { type: Number, min: 0, max: 100, required: true },
    recommendation: { type: String, enum: ['APPROVE', 'REJECT', 'SHORTLIST'], required: true },
    remarks: { type: String, required: true }
  },
  { timestamps: true }
);

juryScoreSchema.index({ jury: 1, application: 1 }, { unique: true });

const JuryScore = mongoose.model('JuryScore', juryScoreSchema);
export default JuryScore;
