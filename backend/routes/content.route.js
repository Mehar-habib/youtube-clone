import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo, getAllVideos } from "../controller/videoController.js";
import { createShort, getAllShorts } from "../controller/shortController.js";

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
router.get("/get-videos", isAuth, getAllVideos);
router.post("/create-short", isAuth, upload.single("shortUrl"), createShort);
router.get("/get-shorts", isAuth, getAllShorts);

export default router;
