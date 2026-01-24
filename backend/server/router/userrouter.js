// userrouter.js
import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getCustomerCount,
  getUserStats,
  login,
  register,
  resendOtp,
  resetPasswordWithOtp,
  updateUser,
} from "../controller/UserController.js";
import verifyToken from "../controller/middleware.js";

const router = Router();

// Auth routes
router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user-stats", getUserStats);
router.get("/customer-count", getCustomerCount);
router.get("/all-users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-user/:id", updateUser);
// OTP send
router.post("/send-otp-email", resendOtp);

// Reset password
router.post("/reset-password", resetPasswordWithOtp);

export default router;
