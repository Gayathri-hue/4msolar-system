import express from "express";
import {
  createEnquiry,
  deleteEnquiry,
  getAllEnquiries,
  getEnquiriesByCustomerId,
  getEnquiryById,
  updateEnquiry,
} from "../controller/enquiryformController.js";

const router = express.Router();

router.post("/createenquiry", createEnquiry);
router.get("/getallenquiry", getAllEnquiries);
router.get("/getoneenquiry/:id", getEnquiryById);
router.get("/getcustomerenquiries/:customerId", getEnquiriesByCustomerId);

router.put("/updateoneenquiry/:id", updateEnquiry);
router.delete("/deleteoneenquiry/:id", deleteEnquiry);

export default router;
