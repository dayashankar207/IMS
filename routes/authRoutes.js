import { registerUser, loginUser } from "../controllers/authController.js";
import { registerValidation, loginValidation } from "../models/userModel.js";

import express from "express";

const router = express.Router();

router.post("/registerUser", registerValidation, registerUser);
router.post("/loginUser", loginValidation, loginUser);

export default router;
