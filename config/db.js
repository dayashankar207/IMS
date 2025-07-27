import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import redis from "redis";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error", err));
redisClient.connect().then(() => console.log("Redis Connected"));

export { connectDB, redisClient };
