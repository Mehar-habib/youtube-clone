import { Router } from "express";
import upload from "../middleware/multer.js";
import {
  googleAuth,
  resetPassword,
  sendOtp,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from "../controller/authController.js";

const router = Router();

router.post("/signup", upload.single("photoUrl"), signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/google-auth", upload.single("photoUrl"), googleAuth);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
