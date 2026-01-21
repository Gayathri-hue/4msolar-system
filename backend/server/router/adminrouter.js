import express from "express";
import { adminLogin, createEmployee } from "../controller/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/adminlogin", adminLogin);
router.post("/createemployee", createEmployee); // Admin creates employee

export default router;
