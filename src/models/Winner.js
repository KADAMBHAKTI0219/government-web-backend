import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination' },
    awardCategory: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    creatorName: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    winnerRank: { type: String, enum: ['1ST_PLACE', '2ND_PLACE', '3RD_PLACE', 'RUNNER_UP', 'SPECIAL_MENTION', 'WINNER'], required: true },
    position: { type: String },
    cashPrizeAwarded: { type: Number, default: 0 },
    juryScore: { type: Number, default: 0 },
    publicVoteScore: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
    announcementDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

winnerSchema.index({ nominationId: 1, winnerRank: 1 });

const Winner = mongoose.model('Winner', winnerSchema);
export default Winner;
