import express from "express";
import {
  adminLogin,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeCount,
  updateEmployee,
} from "../controller/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/adminlogin", adminLogin);
router.post("/createemployee", createEmployee);
router.get("/getemployee", getAllEmployees);
router.put("/employee/:id", updateEmployee);
router.delete("/employee/:id", deleteEmployee);

// Admin creates employee
router.get("/getemployeecount", getEmployeeCount);

export default router;
