import mongoose from 'mongoose';
import { APPLICATION_STATUS, APPLICATION_STAGE } from '../constants/applicationStatuses.js';

const categorySubmissionSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.Mixed, required: true },
  categoryTitle: { type: String },
  description: { type: String, maxlength: 2000, required: true }, // Describe work done in category
  storyLinks: {
    bestStoryLink1: { type: String, required: true }, // Mandatory Best Story Link 1
    bestStoryLink2: { type: String, default: '' },    // Non-mandatory Best Story Link 2
    bestStoryLink3: { type: String, default: '' }     // Non-mandatory Best Story Link 3
  },
  status: { type: String, default: 'PENDING' },
  reviewRemarks: { type: String }
}, { _id: true });

const socialProfileSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['Facebook', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn', 'Other'],
    required: true
  },
  profileUrl: { type: String, required: true },
  followers: { type: mongoose.Schema.Types.Mixed, required: true }, // Number or Alphanumeric (e.g. 50K / 50000)
  isPrimary: { type: Boolean, default: false },
  verified: { type: Boolean, default: false }
}, { _id: true });

const mediaFileSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['document', 'image', 'video', 'portfolio'], default: 'document' },
  fileName: { type: String },
  fileSize: { type: Number },
  cloudinaryPublicId: { type: String }
}, { _id: true });

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  stage: { type: String },
  changedBy: { type: mongoose.Schema.Types.Mixed },
  remarks: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { _id: true });

const nominationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, unique: true, sparse: true }, // Format e.g., NCA-2026-000001
    
    // Q1: Nomination As - Applicant(Self) or Nominator(for Others)
    nominationType: {
      type: String,
      enum: ['SELF', 'THIRD_PARTY'],
      default: 'SELF'
    },

    // Q3: Award Category applied for (National / International, default National)
    awardType: {
      type: String,
      enum: ['National', 'International', 'Indian', 'Non-Indian'],
      default: 'National'
    },

    // Q2 - Q9: Self Applicant Details (If Self Nomination)
    applicant: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      age: { type: String, required: true }, // Dropdown: '18-40', 'Above 40'
      state: { type: String, default: 'Chhattisgarh' }, // State list (Only for National)
      district: { type: String, required: true },        // District list (Only for National)
      nationality: { type: String, default: 'Indian' }
    },

    // Q13 - Q14: Nominator Details (If Nominator / for Others)
    nominator: {
      fullName: { type: String },
      nationality: { type: String, enum: ['Indian', 'Non-Indian', 'International'], default: 'Indian' },
      email: { type: String },
      phone: { type: String }
    },

    // Nominee Details (for Others)
    nominee: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      age: { type: String }, // '18-40', 'Above 40'
      state: { type: String, default: 'Chhattisgarh' },
      district: { type: String }
    },

    // Q9: Select Nomination Category (Max 1 to 3 categories)
    categories: [categorySubmissionSchema],

    // Q10 - Q12: Creator Profile
    creatorProfile: {
      creatorStartYear: { type: String, required: true }, // Q10: When did you become a creator? (Year / Date)
      bio: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
      achievements: [{ type: mongoose.Schema.Types.Mixed }]
    },

    // Q11 & Q12: Social Profiles (Primary Platform Highest followers & Secondary Platform Second Highest followers)
    socialProfiles: [socialProfileSchema],

    declaration: { type: Boolean, default: false },
    recaptchaVerified: { type: Boolean, default: false },
    documents: [mediaFileSchema],

    // Workflow State
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.DRAFT
    },
    currentStage: {
      type: String,
      enum: Object.values(APPLICATION_STAGE),
      default: APPLICATION_STAGE.SUBMISSION
    },

    submittedAt: { type: Date },
    totalVotes: { type: Number, default: 0 },
    averageJuryScore: { type: Number, default: 0 },

    timeline: [timelineSchema]
  },
  { timestamps: true }
);

nominationSchema.index({ status: 1, currentStage: 1 });
nominationSchema.index({ 'applicant.email': 1, 'applicant.phone': 1 });

const Nomination = mongoose.model('Nomination', nominationSchema);
export default Nomination;
