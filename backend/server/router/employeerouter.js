import express from "express";
import {
  employeeLogin,
  getMyLeads,
  getMyLeadStatusCount,
  resendOtpEmployee,
  resetPasswordWithOtpEmployee,
} from "../controller/employeeController.js";
import { protectEmployee } from "../controller/middleware.js";

const router = express.Router();

router.post("/login", employeeLogin);

router.get("/myleads", protectEmployee, getMyLeads);
router.get("/my-leads-status", protectEmployee, getMyLeadStatusCount);

router.post("/reset-otp", resendOtpEmployee);
router.post("/reset-pass", resetPasswordWithOtpEmployee);

// enquiryformrouter.js
// router.get("/getemployeeworks/:employeeId", getEnquiriesByEmployee);

export default router;
