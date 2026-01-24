import express from "express";
import { employeeLogin, getMyLeads } from "../controller/employeeController.js";
import { protectEmployee } from "../controller/middleware.js";

const router = express.Router();

router.post("/login", employeeLogin);

router.get("/myleads", protectEmployee, getMyLeads);

// enquiryformrouter.js
// router.get("/getemployeeworks/:employeeId", getEnquiriesByEmployee);

export default router;
