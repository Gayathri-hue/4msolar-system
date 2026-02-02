import express from "express";
import {
  adminLogin,
  assignOrReassignEmployeeByAdmin,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeCount,
  getEmployeeWorkSummary,
  setEnquiryAmount,
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
// router.post("/assign-enquiry", assignEmployeeByAdmin);
// 🔹 Assign / Reassign Enquiry
router.post("/assign-or-reassign-enquiry", assignOrReassignEmployeeByAdmin);

//set enquiry amout
router.post("/set-enquiry-amount", setEnquiryAmount);
export default router;
