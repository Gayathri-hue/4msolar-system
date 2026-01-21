// userrouter.js
import { Router } from "express";
import {
  getCustomerCount,
  getUserStats,
  login,
  register,
} from "../controller/UserController.js";
import verifyToken from "../controller/middleware.js";

const router = Router();

// Auth routes
router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user-stats", getUserStats);
router.get("/customer-count", getCustomerCount);

export default router;
