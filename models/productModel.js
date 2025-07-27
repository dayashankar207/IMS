import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, default: "" },
});

const productModel = mongoose.model("Product", productSchema);
export default productModel;
