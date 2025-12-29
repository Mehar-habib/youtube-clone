import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo } from "../controller/videoController.js";

const router = Router();

router.post(
  "/create-video",
  isAuth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo
);

export default router;
