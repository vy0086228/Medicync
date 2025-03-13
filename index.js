import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // Load environment variables

const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(express.json());

// Check MongoDB URI
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("MongoDB URI is not defined. Please check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up routes
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
