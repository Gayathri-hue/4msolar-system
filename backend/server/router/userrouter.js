// userrouter.js
import { Router } from "express";
import {
  login,
  register,
  updateProfileImage,
} from "../controller/UserController.js";
import verifyToken from "../controller/middleware.js";
// import upload from "../controller/multer.js";

const router = Router();

// Auth routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.put(
  "/auth/upload-profile/:id",
  verifyToken,

  updateProfileImage
);
export default router;
