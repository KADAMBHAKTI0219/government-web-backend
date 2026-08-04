import mongoose from 'mongoose';

const contactQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['GENERAL', 'FEEDBACK', 'SUPPORT', 'GRIEVANCE'], default: 'GENERAL' },
    status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'], default: 'PENDING' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String }
  },
  { timestamps: true }
);

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);
export default ContactQuery;
