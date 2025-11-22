import Transfer from "../models/Transfer.js";
import * as productService from "../services/productService.js";

// List transfers
export const getTransfers = async (req, res, next) => {
  try {
    const { warehouseId, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (status) filter.status = status;

    const transfers = await Transfer.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("items.productId", "name sku")
      .lean();

    res.json({ success: true, count: transfers.length, data: transfers });
  } catch (err) {
    next(err);
  }
};

// Create internal transfer (within one warehouse)
export const createTransfer = async (req, res, next) => {
  try {
    const payload = req.body || {};
    payload.createdBy = req.user?._id;

    if (!payload.warehouseId || !payload.fromLocation || !payload.toLocation || !Array.isArray(payload.items) || !payload.items.length) {
      return res.status(400).json({ success: false, error: "warehouseId, fromLocation, toLocation and items are required" });
    }

    const transfer = await Transfer.create(payload);
    res.status(201).json({ success: true, data: transfer });
  } catch (err) {
    next(err);
  }
};

// Validate/complete transfer; when moving to DONE for the first time, move stock
export const updateTransferStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["DRAFT", "READY", "DONE", "CANCELED"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const transfer = await Transfer.findById(req.params.id);
    if (!transfer) return res.status(404).json({ success: false, error: "Transfer not found" });

    const previousStatus = transfer.status;
    const isFirstTimeDone = status === "DONE" && previousStatus !== "DONE";

    if (isFirstTimeDone) {
      const items = transfer.items.map((it) => ({
        productId: it.productId,
        qty: Number(it.qty),
        // Use different source/dest warehouses
        fromWarehouseId: transfer.sourceWarehouseId, 
        fromLocationId: transfer.fromLocation,
        toWarehouseId: transfer.destinationWarehouseId,
        toLocationId: transfer.toLocation,
      }));

      await productService.transferStock({
        items,
        userId: req.user?._id,
        referenceId: transfer._id,
      });
    }

    transfer.status = status;
    await transfer.save();

    res.json({ success: true, data: transfer });
  } catch (err) {
    next(err);
  }
};
