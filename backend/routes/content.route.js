import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addReply,
  createVideo,
  getAllVideos,
  getViews,
  toggleDisLikes,
  toggleLikes,
  toggleSave,
} from "../controller/videoController.js";
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
router.put("/video/:videoId/toggle-like", isAuth, toggleLikes);
router.put("/video/:videoId/toggle-dislike", isAuth, toggleDisLikes);
router.put("/video/:videoId/toggle-save", isAuth, toggleSave);
router.put("/video/:videoId/add-view", getViews);
router.post("/video/:videoId/add-comment", isAuth, addComment);
router.post("/video/:videoId/:commentId/add-reply", isAuth, addReply);

export default router;
