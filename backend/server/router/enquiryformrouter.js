import { config } from "dotenv";

config();
import express from "express";

import {
  createEnquiry,
  deleteEnquiry,
  downloadEnquiryPDF,
  getAllEnquiries,
  getEnquiriesByCustomerId,
  getEnquiriesByEmployee,
  getEnquiryById,
  getEnquiryStats,
  getEnquiryStatsByCustomer,
  updateEnquiry,
} from "../controller/enquiryformController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// router.post("/createenquiry", createEnquiry);
router.post("/createenquiry", upload.single("image"), createEnquiry);

router.get("/getallenquiry", getAllEnquiries);
router.get("/getallstatus", getEnquiryStats);
router.get("/getstatus/:customerId", getEnquiryStatsByCustomer);

router.get("/getoneenquiry/:id", getEnquiryById);
router.get("/getcustomerenquiries/:customerId", getEnquiriesByCustomerId);

router.put("/updateoneenquiry/:id", updateEnquiry);
router.delete("/deleteoneenquiry/:id", deleteEnquiry);
// Add this line under other GET routes
router.get("/getemployeeworks/:employeeId", getEnquiriesByEmployee);
//pdf download
router.get("/download/:id", downloadEnquiryPDF);

// router.js

export default router;
