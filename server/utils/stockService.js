import Product from '../models/Product.js';
import StockLedger from '../models/StockLedger.js';
import mongoose from 'mongoose';

/**
 * Adjust product stock for a single (product, warehouse, location).
 * qty may be positive or negative.
 * type = 'RECEIPT'|'DELIVERY'|'TRANSFER'|'ADJUSTMENT'
 */
async function adjustStock({ productId, warehouseId, locationId = null, qty, type, referenceId = null, userId = null }) {
  if (!productId || !warehouseId || typeof qty !== 'number') {
    throw new Error('Invalid args to adjustStock');
  }

  // Use a transaction to ensure product update + ledger entry atomicity
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const product = await Product.findById(productId).session(session);
    if (!product) throw new Error('Product not found');

    // find stock entry for given warehouse/location
    let entryIndex = product.currentStock.findIndex(e =>
      e.warehouseId?.toString() === warehouseId.toString() &&
      ((locationId && e.locationId?.toString() === locationId.toString()) || (!locationId && !e.locationId))
    );

    if (entryIndex === -1) {
      // create new stock entry
      product.currentStock.push({
        warehouseId,
        locationId,
        qty: qty
      });
    } else {
      product.currentStock[entryIndex].qty += qty;
    }

    await product.save({ session });

    // compute balance after (total across warehouses)
    const fresh = await Product.findById(productId).session(session);
    const balanceAfter = fresh.totalStock();

    const ledger = new StockLedger({
      productId,
      type,
      warehouseId,
      fromLocation: type === 'DELIVERY' || type === 'TRANSFER' ? locationId : null,
      toLocation: type === 'RECEIPT' || type === 'TRANSFER' ? locationId : null,
      qty,
      balanceAfter,
      referenceId,
      createdBy: userId
    });

    await ledger.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { product: fresh, ledger };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export { adjustStock };
