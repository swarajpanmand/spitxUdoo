// src/controllers/productController.js
import * as productService from "../services/productService.js";

export const createProduct = async (req, res, next) => {
  try {

    const product = await productService.createProduct(value);
    return res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, warehouseId, search } = req.query;
    // Use simple find + basic search/pagination:
    const filter = { isActive: true };
    if (category) filter.categoryId = category;
    if (search) filter.$or = [{ name: new RegExp(search, "i") }, { sku: new RegExp(search, "i") }, { barcode: new RegExp(search, "i") }];

    // simple paginated query
    const products = await (await import("../models/Product.js")).default.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // optionally inject warehouseStock
    const data = products.map(p => {
      const total = (p.warehouses || []).reduce((s, w) => s + (w.totalQty || 0), 0);
      const warehouseStock = warehouseId ? (p.warehouses || []).find(w => w.warehouseId.toString() === warehouseId.toString()) : null;
      return { ...p, stockLevel: total, warehouseStock: warehouseStock ? warehouseStock.totalQty : undefined };
    });

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await (await import("../models/Product.js")).default.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    product.stockLevel = (product.warehouses || []).reduce((s, w) => s + (w.totalQty || 0), 0);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, { isActive: false });
    res.json({ success: true, message: "Product deactivated", product });
  } catch (err) {
    next(err);
  }
};

// stock endpoints
export const addStock = async (req, res, next) => {
  try {

    const { productId, warehouseId, locationId, qty, referenceId } = value;
    const result = await productService.addStock({ productId, warehouseId, locationId, qty, referenceId, userId: req.user?._id });
    res.json({ success: true, message: "Stock added", ledger: result.ledger, product: result.product });
  } catch (err) {
    next(err);
  }
};

export const removeStock = async (req, res, next) => {
  try {
    const { productId, warehouseId, locationId, qty, referenceId } = value;
    const result = await productService.removeStock({ productId, warehouseId, locationId, qty, referenceId, userId: req.user?._id });
    res.json({ success: true, message: "Stock reduced", ledger: result.ledger, product: result.product });
  } catch (err) {
    next(err);
  }
};

export const transferStock = async (req, res, next) => {
  try {
    const results = await productService.transferStock({ items: value.items, userId: req.user?._id, referenceId: value.referenceId });
    res.json({ success: true, message: "Transfer processed", results });
  } catch (err) {
    next(err);
  }
};

export const upsertBatch = async (req, res, next) => {
  try {
    const product = await productService.upsertBatch(value);
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const { warehouseId } = req.query;
    const data = await productService.getLowStock({ warehouseId });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};
