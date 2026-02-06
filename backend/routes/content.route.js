import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import {
  addComment,
  addReply,
  createVideo,
  deleteVideo,
  fetchVideo,
  getAllVideos,
  getLikedShorts,
  getLikedVideos,
  getSavedVideos,
  getViews,
  toggleDisLikes,
  toggleLikes,
  toggleSave,
  updateVideo,
} from "../controller/videoController.js";
import {
  addCommentForShort,
  addReplyForShort,
  createShort,
  getAllShorts,
  getSavedShorts,
  getViewsForShort,
  toggleDisLikesForShort,
  toggleLikesForShort,
  toggleSaveForShort,
} from "../controller/shortController.js";
import {
  CreatePlaylist,
  getSavedPlaylist,
  toggleSavePlaylist,
} from "../controller/playListController.js";
import {
  addCommentForPost,
  addReplyForPost,
  CreatePost,
  getAllPost,
  toggleLikesForPost,
} from "../controller/postController.js";
import {
  filterCategoryWithAi,
  searchWithAi,
} from "../controller/aiController.js";

const router = Router();

router.post(
  "/create-video",
  isAuth,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createVideo,
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
router.get("/liked-video", isAuth, getLikedVideos);
router.get("/saved-video", isAuth, getSavedVideos);
router.post(
  "/update-video/:videoId",
  isAuth,
  upload.single("thumbnail"),
  updateVideo,
);
router.delete("/delete-video/:videoId", isAuth, deleteVideo);
router.get("/fetch-video/:videoId", fetchVideo);

// shorts routes
router.put("/short/:shortId/toggle-like", isAuth, toggleLikesForShort);
router.put("/short/:shortId/toggle-dislike", isAuth, toggleDisLikesForShort);
router.put("/short/:shortId/toggle-save", isAuth, toggleSaveForShort);
router.put("/short/:shortId/add-view", getViewsForShort);
router.post("/short/:shortId/add-comment", isAuth, addCommentForShort);
router.post("/short/:shortId/:commentId/add-reply", isAuth, addReplyForShort);
router.get("/liked-short", isAuth, getLikedShorts);
router.get("/saved-short", isAuth, getSavedShorts);

// Playlist Route
router.post("/create-playlist", isAuth, CreatePlaylist);
router.post("/playlist/toggle-save", isAuth, toggleSavePlaylist);
router.get("/saved-playlist", isAuth, getSavedPlaylist);

// Posts routes
router.post("/create-post", isAuth, upload.single("image"), CreatePost);
router.get("/get-posts", getAllPost);
router.post("/post/toggle-like", isAuth, toggleLikesForPost);
router.post("/post/add-comment", isAuth, addCommentForPost);
router.post("/post/add-reply", isAuth, addReplyForPost);

// AI route
router.post("/search", isAuth, searchWithAi);
router.post("/filter", isAuth, filterCategoryWithAi);

export default router;
