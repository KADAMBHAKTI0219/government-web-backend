import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tier: {
      type: String,
      enum: ['A_CULTURE_IDENTITY', 'B_NATION_STATE_BUILDING', 'C_CRAFT_PLATFORM', 'GENERAL'],
      default: 'GENERAL'
    },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    taskBrief: { type: String },
    hashtag: { type: String },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    prizeTier: { type: String, enum: ['FLAGSHIP', 'MARQUEE', 'STANDARD', 'SPECIAL'], default: 'STANDARD' },
    cashPrizeMin: { type: Number, default: 0 },
    cashPrizeMax: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    submissionWindow: {
      opensAt: { type: Date },
      closesAt: { type: Date }
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
