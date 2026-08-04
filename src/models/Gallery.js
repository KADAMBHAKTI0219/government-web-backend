import mongoose from 'mongoose';

const mediaItemSchema = new mongoose.Schema({
  title: { type: String },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['photo', 'video'], required: true },
  thumbnailUrl: { type: String },
  caption: { type: String },
  cloudinaryPublicId: { type: String }
}, { _id: true });

const gallerySchema = new mongoose.Schema(
  {
    albumName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String },
    coverImage: { type: String },
    media: [mediaItemSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
