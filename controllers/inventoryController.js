import Product from "../models/productModel.js";
import Inventory from "../models/InventoryModel.js";
import Warehouse from "../models/warehousesModel.js";
import { redisClient } from "../config/db.js";

const addStock = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }
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
    const savedInventory = await inventory.save();
    console.log("Saved inventory:", savedInventory); // Debug log

    const cacheKey = `stock:${productId}:${warehouseId}`;
    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());

    res
      .status(200)
      .json({ message: "Stock updated", quantity: inventory.quantity });
  } catch (err) {
    console.error("Error in addStock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const removeStock = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }
    const { productId, warehouseId, quantity } = req.body;
    const inventory = await Inventory.findOne({ productId, warehouseId });
    if (!inventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }
    if (inventory.quantity < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    inventory.quantity -= quantity;
    const savedInventory = await inventory.save();
    console.log("Saved inventory:", savedInventory); // Debug log

    const cacheKey = `stock:${productId}:${warehouseId}`;
    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());

    res
      .status(200)
      .json({ message: "Stock updated", quantity: inventory.quantity });
  } catch (err) {
    console.error("Error in removeStock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const stockStats = async (req, res) => {
  try {
    const { productId, warehouseId } = req.params;
    const cacheKey = `stock:${productId}:${warehouseId}`;
    const cachedStock = await redisClient.get(cacheKey);

    if (cachedStock) {
      return res.status(200).json({ quantity: parseInt(cachedStock) });
    }
    const inventory = await Inventory.findOne({ productId, warehouseId });
    if (!inventory) {
      console.log(
        `Inventory not found for productId: ${productId}, warehouseId: ${warehouseId}`
      );
      return res.status(404).json({ error: "Inventory not found" });
    }

    await redisClient.setEx(cacheKey, 3600, inventory.quantity.toString());
    res.status(200).json({ quantity: inventory.quantity });
  } catch (err) {
    console.error("Error in stockStats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const lowStock = async (req, res) => {
  try {
    const { threshold = 10, category, warehouseId } = req.query;
    const query = { quantity: { $lt: Number(threshold) } };
    if (category) query["productId.category"] = category;
    if (warehouseId) query.warehouseId = warehouseId;

    const lowStock = await Inventory.find(query)
      .populate("productId", "name sku category")
      .populate("warehouseId", "name");
    res.status(200).json({ lowStock });
  } catch (err) {
    console.error("Error in lowStock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export { addStock, removeStock, stockStats, lowStock };
