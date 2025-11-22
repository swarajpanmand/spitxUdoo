import mongoose from 'mongoose';

const DeliveryItem = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: { type: Number, required: true },
  batchNo: { type: String }
}, { _id: false });

const DeliverySchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  customerAddress: String,

  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },

  status: { 
    type: String, 
    enum: ['PICK', 'PACK', 'READY', 'DONE', 'CANCELED'], 
    default: 'PICK' 
  },

  driver: {
    name: String,
    phone: String
  },

  vehicleNumber: String,
  items: [DeliveryItem],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

export default mongoose.model('Delivery', DeliverySchema);