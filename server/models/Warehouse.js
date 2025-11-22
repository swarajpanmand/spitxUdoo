import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  aisle: String,
  rack: String,
  bin: String
}, { _id: true });

const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  locations: [LocationSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Warehouse', WarehouseSchema);
