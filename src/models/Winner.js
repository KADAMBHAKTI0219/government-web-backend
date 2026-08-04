import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String, enum: ['1ST_PLACE', '2ND_PLACE', '3RD_PLACE', 'SPECIAL_MENTION'], required: true },
    cashPrizeAwarded: { type: Number, default: 0 },
    announcedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

winnerSchema.index({ category: 1, position: 1 }, { unique: true });

const Winner = mongoose.model('Winner', winnerSchema);
export default Winner;
