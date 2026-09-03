import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/roles.js';

const socialMediaSchema = new mongoose.Schema({
  platform: { type: String, enum: ['youtube', 'instagram', 'facebook', 'twitter', 'linkedin', 'other'] },
  url: { type: String, required: true },
  followerCount: { type: Number, default: 0 },
  handle: { type: String }
}, { _id: false });

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String },
  year: { type: Number },
  description: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CREATOR
    },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer Not to Say'], default: 'Prefer Not to Say' },
    dob: { type: Date },
    age: { type: Number },
    district: { type: String, required: true },
    state: { type: String, default: 'Chhattisgarh' },
    address: { type: String },
    pincode: { type: String },

    // Creator Specific Fields
    socialLinks: [socialMediaSchema],
    achievements: [achievementSchema],
    categoryPreferences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    portfolioUrl: { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    videoLink: { type: String, default: '' },
    instagramReelUrl: { type: String, default: '' },

    // Verification & Status
    isEmailVerified: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    refreshToken: { type: String },
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes for fast query lookup and relational referencing (email index is created automatically by unique: true)
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });


// Hash password before saving in a single fast native pass
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

