import express from "express";
import {
  employeeLogin,
  getMyLeads,
  resendOtpEmployee,
  resetPasswordWithOtpEmployee,
} from "../controller/employeeController.js";
import { protectEmployee } from "../controller/middleware.js";

const router = express.Router();

router.post("/login", employeeLogin);

router.get("/myleads", protectEmployee, getMyLeads);
router.post("/reset-otp", resendOtpEmployee);
router.post("/reset-pass", resetPasswordWithOtpEmployee);

// enquiryformrouter.js
// router.get("/getemployeeworks/:employeeId", getEnquiriesByEmployee);

export default router;
