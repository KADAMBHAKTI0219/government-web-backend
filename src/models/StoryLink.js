import mongoose from 'mongoose';

const storyLinkSchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    description: { type: String }
  },
  { timestamps: true }
);

const StoryLink = mongoose.model('StoryLink', storyLinkSchema);
export default StoryLink;
