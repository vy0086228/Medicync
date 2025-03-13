import User from "../models/User.js";
import { comparePassword } from "../middleware/password.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Hospital from "../models/Hospital.js"; // Import Hospital model

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, and email are required." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, passwordHash, email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Login user
let tokenBlacklist = [];

// Login user
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assume comparePassword is a function that compares plain password with hashed password
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRE, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  tokenBlacklist.push(token); // Invalidate the token
  res.json({ message: "Logged out successfully" });
};

// Middleware to check if a token is blacklisted
export const isTokenBlacklisted = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Token is invalid" });
  }

  next();
};

// Register new hospital
export const registerHospital = async (req, res) => {
  try {
    const {
      name,
      address,
      phoneNumber,
      email,
      contactPersonName,
      contactPersonPosition,
      websiteURL,
      specialties,
    } = req.body;

    const hospitalID = generateId("hospitals"); // Implement generateId function

    const newHospital = new Hospital({
      hospitalID,
      name,
      address,
      phoneNumber,
      email,
      contactPersonName,
      contactPersonPosition,
      websiteURL,
      specialties,
    });

    await newHospital.save();
    res.send("Hospital registered successfully.");
  } catch (error) {
    console.error("Error registering hospital:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error loading user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Implement generateId function
const generateId = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};
