import mongoose from 'mongoose';

const creatorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    bio: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    state: { type: String, default: 'Chhattisgarh' },
    district: { type: String },
    primaryPlatform: { type: String },
    totalFollowers: { type: Number, default: 0 },
    achievements: [{ type: String }],
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);
export default CreatorProfile;
