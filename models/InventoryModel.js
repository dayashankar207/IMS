import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  productId: {
    Object: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: True,
  },
  warehouseId: {
    Object: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  quantity: { type: Number, default: 0, min: 0 },
});

const inventoryModel = mongoose.model("Inventory", InventorySchema);
export default inventoryModel;
