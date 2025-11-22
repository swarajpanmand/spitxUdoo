import Product from "../models/Product.js";
import Receipt from "../models/Receipt.js";
import Delivery from "../models/Delivery.js";
import Transfer from "../models/Transfer.js";
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
