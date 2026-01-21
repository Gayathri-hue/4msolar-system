import express from "express";
import { employeeLogin } from "../controller/employeeController.js";
const router = express.Router();

router.post("/login", employeeLogin);

export default router;
