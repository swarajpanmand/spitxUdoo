import Category from "../models/Category.js";

export const getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find({}).lean();
    res.json({ success: true, count: cats.length, data: cats });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });
    const cat = await Category.create({ name, description });
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name && { name }), ...(description && { description }), ...(isActive !== undefined && { isActive }) } },
      { new: true }
    );
    if (!cat) return res.status(404).json({ success: false, error: "Category not found" });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );
    if (!cat) return res.status(404).json({ success: false, error: "Category not found" });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};
