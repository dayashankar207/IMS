import mongoose from "mongoose";

const warehousesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
});

const warehousesModel = mongoose.model("Warehouse", warehousesSchema);
export default warehousesModel;
