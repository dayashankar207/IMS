import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  warehouseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  quantity: { type: Number, default: 0, min: 0 },
});

const inventoryModel = mongoose.model("Inventory", InventorySchema);
export default inventoryModel;
