const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const categorySchema = new Schema(
  {
    tier: {
      type: String,
      enum: ['A_CULTURE_IDENTITY', 'B_NATION_STATE_BUILDING', 'C_CRAFT_PLATFORM'],
      required: true,
      default: 'A_CULTURE_IDENTITY'
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide category title'],
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description']
    },
    taskBrief: {
      type: String,
      default: ''
    },
    hashtag: {
      type: String,
      default: ''
    },
    prizeTier: {
      type: String,
      enum: ['FLAGSHIP', 'MARQUEE', 'STANDARD', 'EMERGING_NANO', 'NRI'],
      required: true,
      default: 'FLAGSHIP'
    },
    cashPrizeMin: {
      type: Number,
      default: 0
    },
    cashPrizeMax: {
      type: Number,
      default: 0
    },
    submissionWindow: {
      opensAt: {
        type: Date,
        default: Date.now
      },
      closesAt: {
        type: Date,
        default: null
      }
    },
    image: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Auto-generate slug before validation if not provided
categorySchema.pre('validate', function () {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

module.exports = mongoose.model('Category', categorySchema);
