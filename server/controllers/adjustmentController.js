import Adjustment from "../models/Adjustment.js";
import * as productService from "../services/productService.js";

// List adjustments
export const getAdjustments = async (req, res, next) => {
  try {
    const { warehouseId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;

    const items = await Adjustment.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("items.productId", "name sku")
      .lean();

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

// Create adjustment and apply stock differences
export const createAdjustment = async (req, res, next) => {
  try {
    const payload = req.body || {};
    payload.createdBy = req.user?._id;

    if (!payload.warehouseId || !Array.isArray(payload.items) || !payload.items.length) {
      return res.status(400).json({ success: false, error: "warehouseId and items are required" });
    }

    for (const item of payload.items) {
      const { productId, systemQty, countedQty } = item;
      if (!productId || typeof systemQty !== "number" || typeof countedQty !== "number") {
        return res.status(400).json({ success: false, error: "productId, systemQty and countedQty are required for each item" });
      }
      const difference = countedQty - systemQty;
      item.difference = difference;

      if (difference > 0) {
        await productService.addStock({
          productId,
          warehouseId: payload.warehouseId,
          locationId: payload.locationId || null,
          qty: difference,
          type: "ADJUSTMENT",
          referenceId: null,
          userId: req.user?._id,
        });
      } else if (difference < 0) {
        await productService.removeStock({
          productId,
          warehouseId: payload.warehouseId,
          locationId: payload.locationId || null,
          qty: Math.abs(difference),
          type: "ADJUSTMENT",
          referenceId: null,
          userId: req.user?._id,
        });
      }
    }

    const doc = await Adjustment.create(payload);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};
