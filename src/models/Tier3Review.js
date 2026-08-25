import mongoose from 'mongoose';

const tier3ReviewSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Public Presence & Recognition
    googleSearchPresence: { type: String, enum: ['HIGH', 'MODERATE', 'LOW'], default: 'MODERATE' },
    mediaMentions: { type: Boolean, default: false },
    publicRecognition: { type: Boolean, default: false },
    awards: { type: Boolean, default: false },
    reputableCollaborations: { type: Boolean, default: false },
    previousControversies: { type: Boolean, default: false },
    factCheckRecords: { type: String },

    // Sensitive Topics Assessment (true if flag/risk present)
    nationalSecurity: { type: Boolean, default: false },
    publicPolicy: { type: Boolean, default: false },
    religiousIssues: { type: Boolean, default: false },
    constitutionalMatters: { type: Boolean, default: false },
    socialMovements: { type: Boolean, default: false },
    protests: { type: Boolean, default: false },
    otherContentiousTopics: { type: Boolean, default: false },

    // Positive Impact Assessment
    communityContribution: { type: Boolean, default: true },
    socialImpact: { type: Boolean, default: true },
    philanthropy: { type: Boolean, default: false },
    positiveInfluence: { type: Boolean, default: true },

    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
    evidenceUrls: [{ type: String }],
    reviewerRemarks: { type: String },
    decision: { type: String, enum: ['PASS', 'FAIL', 'NEEDS_REVIEW'], required: true }
  },
  { timestamps: true }
);

tier3ReviewSchema.index({ nominationId: 1, reviewerId: 1 });

export const Tier3Review = mongoose.model('Tier3Review', tier3ReviewSchema);
export const DueDiligence = Tier3Review;
export default Tier3Review;
