import express from "express";
import multer from "multer";
import path from "path";
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

const router = express.Router();

// ===== Multer setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder already create panniten da
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); // <--- must define this
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
