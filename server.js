import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import {connectDB} from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
