import mongoose from 'mongoose';

const ReceiptItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true }
}, { _id: false });

const ReceiptSchema = new mongoose.Schema({
  supplier: String,
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  status: { type: String, enum: ['DRAFT', 'WAITING', 'READY', 'DONE', 'CANCELED'], default: 'DRAFT' },
  expectedDate: Date,
  notes: String,
  attachments: [String],
  items: [ReceiptItem],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default  mongoose.model('Receipt', ReceiptSchema);
