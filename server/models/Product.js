// src/models/Product.js
import mongoose from "mongoose";

const LocationStockSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  qty: { type: Number, default: 0 }
}, { _id: false });

const WarehouseStockSchema = new mongoose.Schema({
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
  totalQty: { type: Number, default: 0 },
  locations: [LocationStockSchema]
}, { _id: false });

const BatchSchema = new mongoose.Schema({
  batchNo: String,
  expiryDate: Date,
  mfgDate: Date,
  qty: { type: Number, default: 0 }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  barcode: { type: String, index: true, sparse: true },

  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  uom: String,

  warehouses: [WarehouseStockSchema],
  batches: [BatchSchema],

  reorderPoint: { type: Number, default: 0 },
  costPrice: Number,
  sellingPrice: Number,

  dimensions: {
    weight: Number,
    volume: Number
  },

  metadata: { type: Map, of: String },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// total stock across warehouses
ProductSchema.methods.totalStock = function () {
  return this.warehouses.reduce((sum, w) => sum + (w.totalQty || 0), 0);
};


export default mongoose.model("Product", ProductSchema);
