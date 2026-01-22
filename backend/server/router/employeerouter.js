import express from "express";
import {
  employeeLogin,
  getLeadById,
  getMyLeads,
} from "../controller/employeeController.js";

const router = express.Router();

router.post("/login", employeeLogin);
//employeelead
router.get("/get/mylead/:id", getMyLeads);

//leadid

router.get("/lead/:id", getLeadById);

export default router;
