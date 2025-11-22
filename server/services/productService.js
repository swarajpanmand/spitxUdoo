// src/services/productService.js
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Warehouse from "../models/Warehouse.js";
import StockLedger from "../models/StockLedger.js";

/**
 * Create a product
 */
export async function createProduct(payload) {
  // payload: { name, sku, barcode, categoryId, uom, reorderPoint, costPrice, sellingPrice, initialStock: [{warehouseId, locationId, qty}], batches }
  const { initialStock, batches, ...rest } = payload;
  const product = new Product(rest);

  // if initialStock provided, populate warehouses array
  if (Array.isArray(initialStock)) {
    for (const s of initialStock) {
      const { warehouseId, locationId = null, qty = 0 } = s;
      const wh = {
        warehouseId,
        totalQty: qty,
        locations: locationId ? [{ locationId, qty }] : []
      };
      product.warehouses.push(wh);
    }
  }

  if (Array.isArray(batches)) product.batches = batches;

  await product.save();
  return product;
}

/**
 * Basic product update (metadata/name/pricing etc.)
 */
export async function updateProduct(productId, updates) {
  const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
  if (!product) throw { status: 404, message: "Product not found" };
  return product;
}

/**
 * Add stock: increases qty in given warehouse/location and logs ledger.
 * qty must be positive.
 */
export async function addStock({ productId, warehouseId, locationId = null, qty, type = "RECEIPT", referenceId = null, userId = null }) {
  if (qty <= 0) throw { status: 400, message: "qty must be positive" };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).session(session);
    if (!product) throw { status: 404, message: "Product not found" };

    // find warehouse stock entry
    let wh = product.warehouses.find(w => w.warehouseId.toString() === warehouseId.toString());
    if (!wh) {
      wh = { warehouseId, totalQty: 0, locations: [] };
      product.warehouses.push(wh);
    }

    // update location or global warehouse qty
    if (locationId) {
      let loc = wh.locations.find(l => l.locationId.toString() === locationId.toString());
      if (!loc) {
        loc = { locationId, qty: 0 };
        wh.locations.push(loc);
      }
      loc.qty += qty;
    }

    wh.totalQty = (wh.totalQty || 0) + qty;

    await product.save({ session });

    // ledger entry
    const balanceAfter = product.warehouses.reduce((s, w) => s + (w.totalQty || 0), 0);
    const ledger = new StockLedger({
      productId,
      type,
      warehouseId,
      fromLocation: null,
      toLocation: locationId,
      qty,
      balanceAfter,
      referenceId,
      createdBy: userId
    });
    await ledger.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { product, ledger };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

/**
 * Remove stock: decreases qty (for delivery). qty must be positive.
 */
export async function removeStock({ productId, warehouseId, locationId = null, qty, type = "DELIVERY", referenceId = null, userId = null }) {
  if (qty <= 0) throw { status: 400, message: "qty must be positive" };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).session(session);
    if (!product) throw { status: 404, message: "Product not found" };

    const wh = product.warehouses.find(w => w.warehouseId.toString() === warehouseId.toString());
    if (!wh || (wh.totalQty || 0) < qty) throw { status: 400, message: "Insufficient stock in warehouse" };

    if (locationId) {
      const loc = wh.locations.find(l => l.locationId.toString() === locationId.toString());
      if (!loc || (loc.qty || 0) < qty) throw { status: 400, message: "Insufficient stock in location" };
      loc.qty -= qty;
    } else {
      // if no location, remove from warehouse-level: greedily remove from locations
      let remaining = qty;
      // sort locations maybe by any rule (FIFO not implemented here)
      for (const loc of wh.locations) {
        if (remaining <= 0) break;
        const take = Math.min(loc.qty, remaining);
        loc.qty -= take;
        remaining -= take;
      }
      if (remaining > 0) {
        // some remaining, that means stock mismatch - reduce total but throw? we'll prevent
        throw { status: 400, message: "Insufficient stock at location granularity" };
      }
    }

    wh.totalQty -= qty;

    await product.save({ session });

    const balanceAfter = product.warehouses.reduce((s, w) => s + (w.totalQty || 0), 0);
    const ledger = new StockLedger({
      productId,
      type,
      warehouseId,
      fromLocation: locationId || null,
      toLocation: null,
      qty: -qty,
      balanceAfter,
      referenceId,
      createdBy: userId
    });
    await ledger.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { product, ledger };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

/**
 * Transfer stock between warehouses (or between locations inside warehouses)
 * items: [{ productId, qty, fromWarehouseId, fromLocationId, toWarehouseId, toLocationId }]
 */
export async function transferStock({ items = [], userId = null, referenceId = null }) {
  if (!Array.isArray(items) || items.length === 0) throw { status: 400, message: "items required" };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const results = [];
    for (const it of items) {
      const { productId, qty, fromWarehouseId, fromLocationId = null, toWarehouseId, toLocationId = null } = it;
      if (!productId || !qty || !fromWarehouseId || !toWarehouseId) throw { status: 400, message: "invalid item" };

      // remove from source
      await removeStock({ productId, warehouseId: fromWarehouseId, locationId: fromLocationId, qty, type: "TRANSFER", referenceId, userId });

      // add to dest
      await addStock({ productId, warehouseId: toWarehouseId, locationId: toLocationId, qty, type: "TRANSFER", referenceId, userId });

      results.push({ productId, qty, fromWarehouseId, toWarehouseId });
    }

    await session.commitTransaction();
    session.endSession();
    return results;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

/**
 * Add / update batch
 * payload: { productId, batchNo, qty, mfgDate, expiryDate }
 */
export async function upsertBatch({ productId, batchNo, qty = 0, mfgDate = null, expiryDate = null }) {
  const product = await Product.findById(productId);
  if (!product) throw { status: 404, message: "Product not found" };

  const existing = product.batches.find(b => b.batchNo === batchNo);
  if (existing) {
    existing.qty = qty;
    if (mfgDate) existing.mfgDate = mfgDate;
    if (expiryDate) existing.expiryDate = expiryDate;
  } else {
    product.batches.push({ batchNo, qty, mfgDate, expiryDate });
  }
  await product.save();
  return product;
}

/**
 * Get low stock (global or per warehouse)
 */
export async function getLowStock({ warehouseId = null }) {
  const products = await Product.find({ isActive: true }).lean();
  const low = [];
  for (const p of products) {
    const total = p.warehouses?.reduce((s, w) => s + (w.totalQty || 0), 0) || 0;
    if (warehouseId) {
      const wh = p.warehouses?.find(w => w.warehouseId.toString() === warehouseId.toString());
      const wq = wh ? wh.totalQty : 0;
      if (wq <= (p.reorderPoint || 0)) low.push({ ...p, warehouseStock: wq, totalStock: total });
    } else {
      if (total <= (p.reorderPoint || 0)) low.push({ ...p, totalStock: total });
    }
  }
  return low;
}
