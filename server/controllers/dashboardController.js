import Product from "../models/Product.js";
import Receipt from "../models/Receipt.js";
import Delivery from "../models/Delivery.js";
import Transfer from "../models/Transfer.js";
import StockLedger from "../models/StockLedger.js";
import * as productService from "../services/productService.js";

export const getKpis = async (req, res, next) => {
  try {
    const { warehouseId, categoryId } = req.query;

    // Products
    const productFilter = { isActive: true };
    if (categoryId) productFilter.categoryId = categoryId;

    const products = await Product.find(productFilter).lean();

    let totalProductsInStock = 0;
    let totalStockUnits = 0;

    for (const p of products) {
      const total = (p.warehouses || []).reduce((s, w) => s + (w.totalQty || 0), 0);
      if (!warehouseId) {
        if (total > 0) totalProductsInStock += 1;
        totalStockUnits += total;
      } else {
        const wh = (p.warehouses || []).find((w) => w.warehouseId?.toString() === warehouseId.toString());
        const whQty = wh ? wh.totalQty || 0 : 0;
        if (whQty > 0) totalProductsInStock += 1;
        totalStockUnits += whQty;
      }
    }

    // Low stock / out of stock
    const lowStockItems = await productService.getLowStock({ warehouseId: warehouseId || null });
    const lowStockCount = lowStockItems.length;

    let outOfStockCount = 0;
    for (const p of products) {
      const total = (p.warehouses || []).reduce((s, w) => s + (w.totalQty || 0), 0);
      if (total === 0) outOfStockCount += 1;
    }

    // Pending docs
    const pendingReceiptsCount = await Receipt.countDocuments({
      status: { $in: ["DRAFT", "WAITING", "READY"] },
      ...(warehouseId ? { warehouseId } : {}),
    });

    const pendingDeliveriesCount = await Delivery.countDocuments({
      status: { $in: ["PICK", "PACK", "READY"] },
      ...(warehouseId ? { warehouseId } : {}),
    });

    const internalTransfersScheduledCount = await Transfer.countDocuments({
      status: { $in: ["DRAFT", "READY"] },
      ...(warehouseId ? { warehouseId } : {}),
    });

    res.json({
      success: true,
      data: {
        totalProductsInStock,
        totalStockUnits,
        lowStockCount,
        outOfStockCount,
        pendingReceiptsCount,
        pendingDeliveriesCount,
        internalTransfersScheduledCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Recent activity feed for dashboard
export const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 10, warehouseId, type } = req.query;

    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (type) filter.type = type.toUpperCase();

    const docs = await StockLedger.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate({ path: "productId", select: "name" })
      .populate({ path: "createdBy", select: "name" })
      .lean();

    const data = docs.map((entry) => ({
      id: entry._id,
      type: (entry.type || '').toLowerCase(),
      referenceId: entry.referenceId || null,
      referenceNumber: entry.referenceId ? String(entry.referenceId) : null,
      productId: entry.productId?._id || null,
      productName: entry.productId?.name || null,
      quantity: Math.abs(entry.qty || 0),
      timestamp: entry.createdAt,
      userId: entry.createdBy?._id || null,
      userName: entry.createdBy?.name || null,
    }));

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};