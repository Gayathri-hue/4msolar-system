import express from "express";
import {
  adminLogin,
  createEmployee,
  getEmployeeCount,
} from "../controller/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/adminlogin", adminLogin);
router.post("/createemployee", createEmployee);
// Admin creates employee
router.get("/getemployeecount", getEmployeeCount);

export default router;
