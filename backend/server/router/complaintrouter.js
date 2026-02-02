import { Router } from "express";
import {
  createServiceRequest,
  getAllServiceRequests,
} from "../controller/complaintController.js";

const router = Router();

router.post("/service-request", createServiceRequest);
router.get("/get-service-request", getAllServiceRequests);

export default router;
