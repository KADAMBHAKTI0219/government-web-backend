import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g. 'hero', 'about', 'timeline', 'faq', 'footer', 'govt_messages', 'vision_mission'
    title: { type: String },
    subtitle: { type: String },
    content: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON content flexible for each section
    lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const CMS = mongoose.model('CMS', cmsSchema);
export default CMS;
