import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  newProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Admin-only routes
router.post("/newProduct", auth(["admin"]), newProduct);
router.put("/updateProduct/:id", auth(["admin"]), updateProduct);
router.delete("/deleteProduct/:id", auth(["admin"]), deleteProduct);

// Admin and user routes
router.get("/getProduct", auth(["admin", "user"]), getProduct);

export default router;
