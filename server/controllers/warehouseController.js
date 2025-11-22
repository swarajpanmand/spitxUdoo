import Warehouse from "../models/Warehouse.js";

export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find({}).lean();
    res.json({ success: true, count: warehouses.length, data: warehouses });
  } catch (err) {
    next(err);
  }
};

export const createWarehouse = async (req, res, next) => {
  try {
    const { name, address, locations } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });
    const warehouse = await Warehouse.create({ name, address, locations: locations || [] });
    res.status(201).json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const { name, address, isActive } = req.body;
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(name && { name }), ...(address && { address }), ...(isActive !== undefined && { isActive }) } },
      { new: true }
    );
    if (!warehouse) return res.status(404).json({ success: false, error: "Warehouse not found" });
    res.json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};

// Add a single location to a warehouse
export const addLocation = async (req, res, next) => {
  try {
    const { name, aisle, rack, bin } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "name is required" });

    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, error: "Warehouse not found" });

    warehouse.locations.push({ name, aisle, rack, bin });
    await warehouse.save();

    res.status(201).json({ success: true, data: warehouse });
  } catch (err) {
    next(err);
  }
};
