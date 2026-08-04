import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Null for system wide broadcast
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['SYSTEM', 'EMAIL', 'DASHBOARD', 'ANNOUNCEMENT', 'APPLICATION_UPDATE'],
      default: 'DASHBOARD'
    },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    isBroadcast: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
