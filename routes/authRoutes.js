import { registerUser, loginUser } from "../controllers/authController.js";

import express from "express";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/loginUser", loginUser);

export default router;
