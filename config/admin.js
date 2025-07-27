import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import User from "../models/userModel.js";
import winston from "winston";

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.resolve(process.cwd(), "logs/setup.log") }),
  ],
});

const setupAdmin = async () => {
  try {
    // Log environment variables (for debugging, remove in production)
    logger.info(`MONGO_URI: ${process.env.MONGO_URI ? "set" : "undefined"}`);
    logger.info(`admin_username: ${process.env.admin_username ? "set" : "undefined"}`);
    logger.info(`admin_password: ${process.env.admin_password ? "set" : "undefined"}`);
    logger.info(`admin_email: ${process.env.admin_email ? "set" : "undefined"}`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected for admin setup");

    // Get admin credentials from environment variables
    const adminUsername = process.env.admin_username;
    const adminPassword = process.env.admin_password;
    const adminEmail = process.env.admin_email;

    // Validate credentials
    if (!adminUsername || !adminPassword || !adminEmail) {
      logger.error("Admin username, password, or email not provided in environment variables");
      throw new Error("admin_username, admin_password, and admin_email must be set in .env");
    }

    if (adminPassword.length < 8) {
      logger.error("Admin password too short");
      throw new Error("Admin password must be at least 8 characters");
    }

    // Check if admin exists
    const adminExists = await User.findOne({ username: adminUsername });
    if (adminExists) {
      logger.info(`Admin account with username '${adminUsername}' already exists`);
      await mongoose.connection.close();
      return;
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new User({
      username: adminUsername,
      password: hashedPassword,
      email: adminEmail,
      role: "admin",
    });
    await admin.save();
    logger.info(`Admin account created: username=${adminUsername}, email=${adminEmail}`);

    // Close connection
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error setting up admin account:", err);
    process.exit(1);
  }
};

// Run the setup
setupAdmin();