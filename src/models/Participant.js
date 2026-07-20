const mongoose = require('mongoose');

const categorySubmissionSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select an award category']
    },
    submissionLink: {
      type: String,
      required: [true, 'Please provide content submission link'],
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const participantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide mobile number'],
      trim: true,
      unique: true,
      index: true
    },
    age: {
      type: Number,
      required: [true, 'Please provide age']
    },
    district: {
      type: String,
      required: [true, 'Please provide district'],
      trim: true
    },
    platform: {
      type: String,
      required: [true, 'Please specify primary content platform'],
      trim: true
    },
    // Array of category submissions managed per participant
    categorySubmissions: [categorySubmissionSchema],
    // Optional Social Links
    instagram: {
      type: String,
      trim: true,
      default: ''
    },
    youtube: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    linkedin: {
      type: String,
      trim: true,
      default: ''
    },
    // Additional Options
    isInternational: {
      type: Boolean,
      default: false
    },
    privacyAccepted: {
      type: Boolean,
      required: [true, 'Privacy policy acceptance is required'],
      default: true
    },
    consentAccepted: {
      type: Boolean,
      required: [true, 'Content consent acceptance is required'],
      default: true
    },
    isMobVerified: {
      type: Boolean,
      default: true
    },
    otpVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for primary/latest category
participantSchema.virtual('category').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].category;
  }
  return null;
});

// Virtual property for primary/latest submissionLink
participantSchema.virtual('submissionLink').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].submissionLink;
  }
  return '';
});

// Virtual property for primary/latest status
participantSchema.virtual('status').get(function () {
  if (this.categorySubmissions && this.categorySubmissions.length > 0) {
    return this.categorySubmissions[this.categorySubmissions.length - 1].status;
  }
  return 'SUBMITTED';
});

module.exports = mongoose.model('Participant', participantSchema);
