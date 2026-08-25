import mongoose from 'mongoose';

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    nominationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nomination', required: true },
    applicationId: { type: String },
    status: { type: String, required: true },
    currentStage: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    remarks: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

applicationStatusHistorySchema.index({ nominationId: 1, timestamp: -1 });

const ApplicationStatusHistory = mongoose.model('ApplicationStatusHistory', applicationStatusHistorySchema);
export default ApplicationStatusHistory;
