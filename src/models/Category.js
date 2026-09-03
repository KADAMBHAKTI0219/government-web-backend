import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    categoryNumber: { type: Number, required: true, index: true },
    title: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    tier: {
      type: String,
      required: true,
      default: 'GENERAL',
      index: true
    },
    tierNumber: { type: Number, default: 1, index: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    taskBrief: { type: String },
    hashtag: { type: String },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    prizeTier: { type: String, enum: ['FLAGSHIP', 'MARQUEE', 'STANDARD', 'SPECIAL'], default: 'STANDARD', index: true },
    cashPrizeMin: { type: Number, default: 0 },
    cashPrizeMax: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    submissionWindow: {
      opensAt: { type: Date, index: true },
      closesAt: { type: Date, index: true }
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);

// Single & Compound Indexes for High Performance Queries & Sorting
categorySchema.index({ slug: 1 });
categorySchema.index({ title: 1 });
categorySchema.index({ categoryNumber: 1 });
categorySchema.index({ tierNumber: 1 });
categorySchema.index({ tier: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ prizeTier: 1 });
categorySchema.index({ order: 1 });
categorySchema.index({ createdAt: -1 });

// Compound Indexes
categorySchema.index({ isActive: 1, categoryNumber: 1, tierNumber: 1, order: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1, order: 1 });
categorySchema.index({ tier: 1, tierNumber: 1, categoryNumber: 1 });
categorySchema.index({ prizeTier: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);
export default Category;


