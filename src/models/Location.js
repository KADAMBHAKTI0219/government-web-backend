import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, trim: true },
    cityCode: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { _id: true, timestamps: true }
);

const locationSchema = new mongoose.Schema(
  {
    stateName: { type: String, required: true, unique: true, trim: true },
    stateCode: { type: String, trim: true },
    country: { type: String, default: 'India' },
    cities: [citySchema], // Nested array of cities/districts
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);
export default Location;
