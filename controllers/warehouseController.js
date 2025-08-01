import Warehouse from "../models/warehousesModel.js";

const createNewWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: "Name and location is required" });
    }
    const warehouse = new Warehouse({ name, location });
    await warehouse.save();
    res.status(201).json({ message: "Warehouse created", warehouse });
  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
};

const viewAllWarehouse = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export { createNewWarehouse, viewAllWarehouse };
