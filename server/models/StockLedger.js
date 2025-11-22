import mongoose from 'mongoose';

const StockLedgerSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['RECEIPT', 'DELIVERY', 'TRANSFER', 'ADJUSTMENT'], required: true },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  fromLocation: { type: mongoose.Schema.Types.ObjectId, default: null },
  toLocation: { type: mongoose.Schema.Types.ObjectId, default: null },
  qty: { type: Number, required: true },
  balanceAfter: { type: Number },
  referenceId: { type: mongoose.Schema.Types.ObjectId },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: false } });

export default mongoose.model('StockLedger', StockLedgerSchema);
