import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetCollection: { type: String, required: true },
    targetId: { type: String, required: true },
    action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'SCORE_SUBMITTED'], required: true },
    previousState: { type: mongoose.Schema.Types.Mixed },
    newState: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String }
  },
  { timestamps: true }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
