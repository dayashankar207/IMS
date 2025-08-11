import {
  createNewWarehouse,
  viewAllWarehouse,
} from "../controllers/warehouseController.js";
import auth from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/newWarehouse", auth(["admin"]), createNewWarehouse);
router.post("/allWarehouse", auth(["admin"]), viewAllWarehouse);

export default router;
