import express from "express";
import {
  registerUser,
  loginUser,
  registerHospital,
  getUserById,
  logoutUser,
  isTokenBlacklisted,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isTokenBlacklisted, logoutUser);
router.post("/register-hospital", registerHospital);
router.get("/user/:id", getUserById);

export default router;
