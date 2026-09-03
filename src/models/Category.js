import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    categoryNumber: { type: Number, required: true },
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tier: {
      type: String,
      required: true,
      default: 'GENERAL'
    },
    tierNumber: { type: Number, default: 1 },
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

categorySchema.index({ categoryNumber: 1 });
categorySchema.index({ tierNumber: 1 });
categorySchema.index({ isActive: 1, categoryNumber: 1, tierNumber: 1, order: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;


