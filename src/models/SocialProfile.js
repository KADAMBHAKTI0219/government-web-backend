import mongoose from 'mongoose';

const socialProfileSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    platform: {
      type: String,
      enum: ['Instagram', 'YouTube', 'Facebook', 'X/Twitter', 'LinkedIn', 'Other'],
      required: true
    },
    profileUrl: { type: String, required: true },
    followers: { type: Number, default: 0 },
    isPrimary: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const SocialProfile = mongoose.model('SocialProfile', socialProfileSchema);
export default SocialProfile;
