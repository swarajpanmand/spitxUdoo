import Delivery from "../models/Delivery.js";
import * as productService from "../services/productService.js";

// List deliveries with optional filters
export const getDeliveries = async (req, res, next) => {
  try {
    const { status, warehouseId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (warehouseId) filter.warehouseId = warehouseId;

    const deliveries = await Delivery.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("items.productId", "name sku")
      .lean();

    res.json({ success: true, count: deliveries.length, data: deliveries });
  } catch (err) {
    next(err);
  }
};

// Create a delivery order (PICK by default via schema)
export const createDelivery = async (req, res, next) => {
  try {
    const payload = req.body || {};
    payload.createdBy = req.user?._id;

    if (!payload.warehouseId || !Array.isArray(payload.items) || !payload.items.length) {
      return res.status(400).json({ success: false, error: "warehouseId and items are required" });
    }

    const delivery = await Delivery.create(payload);
    res.status(201).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

// Update status; when moving to DONE for the first time, reduce stock
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["PICK", "PACK", "READY", "DONE", "CANCELED"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, error: "Delivery not found" });

    const previousStatus = delivery.status;
    const isFirstTimeDone = status === "DONE" && previousStatus !== "DONE";

    if (isFirstTimeDone) {
      for (const item of delivery.items) {
        await productService.removeStock({
          productId: item.productId,
          warehouseId: delivery.warehouseId,
          locationId: null,
          qty: Number(item.qty),
          type: "DELIVERY",
          referenceId: delivery._id,
          userId: req.user?._id,
        });
      }
    }

    delivery.status = status;
    await delivery.save();

    res.json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};
