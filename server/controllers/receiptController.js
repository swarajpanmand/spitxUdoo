import Receipt from '../models/Receipt.js'; 
import Product from '../models/Product.js';
import * as productService from "../services/productService.js";

export const createReceipt = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.createdBy = req.user._id;
    const receipt = await Receipt.create(payload);
    res.json({ success: true, data: receipt });
  } catch (err) {
    next(err);
  }
};

/**
 * Validate / finalize a receipt: add items quantities to stock and mark receipt DONE
 */
export const validateReceipt = async (req, res, next) => {
  try {
    const receiptId = req.params.id;
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) return res.status(404).json({ success: false, error: 'Receipt not found' });
    if (receipt.status === 'DONE') return res.status(400).json({ success: false, error: 'Already validated' });

    // For each item, add stock to the corresponding product/warehouse using the central productService
    for (const item of receipt.items) {
      await productService.addStock({
        productId: item.productId,
        warehouseId: receipt.warehouseId,
        locationId: null,
        qty: Number(item.qty),
        type: 'RECEIPT',
        referenceId: receipt._id,
        userId: req.user._id
      });
    }

    receipt.status = 'DONE';
    await receipt.save();

    res.json({ success: true, message: 'Receipt validated, stock updated', data: receipt });
  } catch (err) {
    next(err);
  }
};

export const getAllReceipts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const items = await Receipt.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('items.productId', 'name sku');
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};
