import StockLedger from "../models/StockLedger.js";

export const getMoveHistory = async (req, res, next) => {
  try {
    const {
      type, // RECEIPT|DELIVERY|TRANSFER|ADJUSTMENT
      warehouseId,
      productId,
      categoryId,
      fromDate,
      toDate,
      page = 1,
      limit = 50,
    } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (warehouseId) filter.warehouseId = warehouseId;
    if (productId) filter.productId = productId;

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    let query = StockLedger.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({ path: "productId", select: "name sku categoryId" })
      .populate({ path: "warehouseId", select: "name" });

    let data = await query.lean();

    if (categoryId) {
      data = data.filter((entry) => entry.productId?.categoryId?.toString() === categoryId.toString());
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};
