import mongoose from 'mongoose';

const categoryItemSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.Mixed },
  categoryTitle: { type: String },
  description: { type: String, maxlength: 2000 },
  bestStoryLink1: { type: String },
  bestStoryLink2: { type: String, default: '' },
  bestStoryLink3: { type: String, default: '' },
  videoLink: { type: String, default: '' },
  mainVideoLink: { type: String, default: '' },
  reelUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  instagramReelUrl: { type: String, default: '' },
  instagramLink: { type: String, default: '' },
  district: { type: String },
  cityId: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const socialPlatformSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['Facebook', 'Instagram', 'YouTube', 'Twitter', 'X', 'LinkedIn', 'facebook', 'instagram', 'youtube', 'twitter', 'linkedin', 'Other'],
  },
  profileUrl: { type: String },
  followers: { type: mongoose.Schema.Types.Mixed }, // String or Number (e.g. 50K / 50000)
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const participantSchema = new mongoose.Schema(
  {
    // Q1: Nomination As - SELF (Applicant) or THIRD_PARTY (Nominator for Others)
    nominationType: {
      type: String,
      enum: ['SELF', 'THIRD_PARTY', 'Applicant(Self)', 'Nominator(for Others)'],
      default: 'SELF'
    },

    // Q3: Award Category applied for (National / International)
    awardType: {
      type: String,
      enum: ['National', 'International', 'Indian', 'Non-Indian'],
      default: 'National'
    },

    // Standard / Applicant Details
    name: { type: String, required: true },
    fullName: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    age: { type: String, default: '18-40' }, // '18-40', 'Above 40'
    state: { type: String, default: 'Chhattisgarh' },
    district: { type: String, required: true },
    cityId: { type: mongoose.Schema.Types.Mixed }, // Selected City ID
    nationality: { type: String, enum: ['Indian', 'Non-Indian', 'International'], default: 'Indian' },

    // If Nominator (for Others) - Details of the person nominating
    nominator: {
      fullName: { type: String, default: '' },
      nationality: { type: String, enum: ['Indian', 'Non-Indian', 'International'], default: 'Indian' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' }
    },

    // Nominee Details (Details of creator being nominated)
    nominee: {
      fullName: { type: String, default: '' },
      awardType: { type: String, enum: ['National', 'International'], default: 'National' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      age: { type: String },
      state: { type: String, default: 'Chhattisgarh' },
      district: { type: String, default: '' },
      cityId: { type: mongoose.Schema.Types.Mixed }
    },

    // Category / Categories (Supports single category mixed or up to 3 category nominations)
    category: { type: mongoose.Schema.Types.Mixed },
    categories: [categoryItemSchema],

    // Story links & Work summary (backward compatible & Excel spec)
    workSummary: { type: String },
    contentUrl: { type: String },
    bestStoryLink1: { type: String },
    bestStoryLink2: { type: String, default: '' },
    bestStoryLink3: { type: String, default: '' },

    // Main Video Link / Instagram Reel URL fields (Admin visible & redirectable)
    videoLink: { type: String, default: '' },
    mainVideoLink: { type: String, default: '' },
    reelUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    instagramReelUrl: { type: String, default: '' },
    instagramLink: { type: String, default: '' },

    // Creator Profile
    creatorStartYear: { type: String, default: '' },
    whenBecomeCreator: { type: String, default: '' },

    // Social Media Platforms
    primaryPlatform: socialPlatformSchema,
    secondaryPlatform: socialPlatformSchema,
    socialProfiles: [socialPlatformSchema],

    // Registration Status
    status: {
      type: String,
      enum: ['PENDING', 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  { timestamps: true }
);

participantSchema.index({ email: 1 });
participantSchema.index({ phone: 1 });
participantSchema.index({ status: 1, createdAt: -1 });
participantSchema.index({ category: 1 });

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;



