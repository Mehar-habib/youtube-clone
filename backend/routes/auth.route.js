import { Router } from "express";
import upload from "../middleware/multer.js";
import {
  googleAuth,
  signIn,
  signOut,
  signUp,
} from "../controller/authController.js";

const router = Router();

router.post("/signup", upload.single("photoUrl"), signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/google-auth", upload.single("photoUrl"), googleAuth);

export default router;
