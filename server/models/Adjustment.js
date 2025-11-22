import mongoose from 'mongoose';

const AdjustmentItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  systemQty: Number,
  countedQty: Number,
  difference: Number
}, { _id: false });

const AdjustmentSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  locationId: { type: mongoose.Schema.Types.ObjectId },
  reason: String,
  notes: String,
  items: [AdjustmentItem],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Adjustment', AdjustmentSchema);