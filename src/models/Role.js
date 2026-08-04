import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    permissions: [{ type: String }], // Array of permission strings e.g. 'users:read', 'nominations:review'
    isSystemRole: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);
export default Role;
