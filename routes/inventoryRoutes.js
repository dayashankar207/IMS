import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
  addStock,
  removeStock,
  stockStats,
  lowStock,
  stockByWarehouse,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/add", auth(["admin"]), addStock);
router.post("/remove", auth(["admin"]), removeStock);
router.get("/stats/:productId/:warehouseId", auth(["admin"]), stockStats);
router.post("/low-stock", auth(["admin"]), lowStock);
router.post("/stockByWarehouse", auth(["admin"]), stockByWarehouse);

export default router;
