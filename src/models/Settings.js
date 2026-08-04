import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    isVotingEnabled: { type: Boolean, default: false },
    isRegistrationOpen: { type: Boolean, default: true },
    isNominationOpen: { type: Boolean, default: true },
    portalTitle: { type: String, default: 'Chhattisgarh State Creator & Influencer Awards' },
    contactEmail: { type: String, default: 'support@cgawards.gov.in' },
    contactPhone: { type: String, default: '+91-771-2345678' },
    maxNominationsPerCreator: { type: Number, default: 3 },
    juryMinScore: { type: Number, default: 60 }
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
