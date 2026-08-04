import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED'], default: 'DRAFT' },
    scheduledAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);
export default News;
