import mongoose from 'mongoose';

const TransferItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number
}, { _id: false });

const TransferSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  fromLocation: { type: mongoose.Schema.Types.ObjectId },
  toLocation: { type: mongoose.Schema.Types.ObjectId },
  reason: String,
  status: { type: String, enum: ['DRAFT', 'READY', 'DONE', 'CANCELED'], default: 'DRAFT' },
  items: [TransferItem],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Transfer', TransferSchema);
