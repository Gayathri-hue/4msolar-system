import express from "express";
import {
  adminLogin,
  assignEmployeeByAdmin,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeCount,
  getEmployeeWorkSummary,
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
//work summery

router.get("/employee-work-summary", getEmployeeWorkSummary);

//assign work
router.post("/assign-enquiry", assignEmployeeByAdmin);
export default router;
