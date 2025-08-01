import express from "express";
import auth from "../middleware/authMiddleware.js";

import {
  addStock,
  removeStock,
  stockStats,
  lowStock,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/add", auth(["admin"]), addStock);
router.post("/remove", auth(["admin"]), removeStock);
router.get("/stats/:productId/:warehouseId", auth(["admin"]), stockStats);
router.post("/low-stock", auth(["admin"]), lowStock);

export default router;
