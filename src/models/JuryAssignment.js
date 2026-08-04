import mongoose from 'mongoose';

const juryAssignmentSchema = new mongoose.Schema(
  {
    jury: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
    assignedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

juryAssignmentSchema.index({ jury: 1, application: 1 }, { unique: true });

const JuryAssignment = mongoose.model('JuryAssignment', juryAssignmentSchema);
export default JuryAssignment;
