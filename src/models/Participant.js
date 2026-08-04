import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    district: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    workSummary: { type: String, required: true },
    contentUrl: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }
  },
  { timestamps: true }
);

const Participant = mongoose.model('Participant', participantSchema);
export default Participant;
