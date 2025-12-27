import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser } from "../controller/userController.js";

const router = Router();
router.get("/user", isAuth, getCurrentUser);

export default router;
