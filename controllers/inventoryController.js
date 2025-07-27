import Product from "../models/productModel.js";
import Inventory from "../models/InventoryModel.js";
import Warehouse from "../models/warehousesModel.js";
import { redisClient } from "../config/db.js";

const addStock = async (req, res) => {
  try {
    const { productId, warehouseId, quantity } = req.body;
    if (!productId || !warehouseId || !quantity) {
      return res
        .status(400)
        .json({ error: "Product ID, warehouse ID, and quantity required" });
    }
    const product = await Product.findById(productId);
    const warehouse = await Warehouse.findById(warehouseId);
    if (!product || !warehouse) {
      return res.status(404).json({ error: "Product or warehouse not found" });
    }
    let inventory = await Inventory.findOne({ productId, warehouseId });
    if (inventory) {
      inventory.quantity += quantity;
    } else {
      inventory = new Inventory({ productId, warehouseId, quantity });
    }
    await inventory.save();

    //Update redis cache
    const cacheKey = `stock:${productId}:${warehouseId}`;
    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());

    res
      .status(200)
      .json({ message: "Stock updated", quantity: inventory.quantity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const removeStock = async (req, res) => {
  try {
    const { productId, warehouseId, quantity } = req.body;
    const inventory = await Inventory.findOne({ productId, warehouseId });
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    if (inventory.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    inventory.quantity -= quantity;
    await inventory.save();
    const cacheKey = `stock:${productId}:${warehouseId}`;
    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());

    res
      .status(200)
      .json({ message: "Stock updated", quantity: inventory.quantity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const stockStats = async (req, res) => {
  try {
    const { productId, warehouseId } = req.params;
    const cacheKey = `stock:${productId}:${warehouseId}`;
    const cachedStock = await redisClient.get(cacheKey);

    if (cachedStock) {
      return res.status(200).json({ quantity: parseInt(cacheStock) });
    }
    const inventory = await Inventory.findOne({ productId, warehouseId });
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());
    res.status(200).json({ quantity: inventory.quantity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const lowStock = async (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const lowStock = await Inventory.find({ quantity: { $lt: threshold } })
      .populate("productId", "name sku")
      .populate("warehouseId", "name");
    res.status(200).json(lowStock);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export { addStock, removeStock, stockStats, lowStock };
