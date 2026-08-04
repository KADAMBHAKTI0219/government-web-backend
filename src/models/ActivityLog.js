import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g. 'LOGIN', 'SUBMIT_NOMINATION', 'CAST_VOTE'
    description: { type: String, required: true },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
