import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
  addHistory,
  createChannel,
  getAllChannelData,
  getChannelData,
  getCurrentUser,
  getHistory,
  getSubscribedData,
  toggleSubscriber,
  updateChannel,
} from "../controller/userController.js";
import upload from "../middleware/multer.js";

const router = Router();
router.get("/get-user", isAuth, getCurrentUser);
router.post(
  "/create-channel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createChannel,
);
router.get("/get-channel", isAuth, getChannelData);
router.post(
  "/update-channel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateChannel,
);
router.get("/all-channel", isAuth, getAllChannelData);
router.post("/toggle-subscribe", isAuth, toggleSubscriber);
router.get("/subscribed-data", isAuth, getSubscribedData);
router.post("/add-history", isAuth, addHistory);
router.get("/get-history", isAuth, getHistory);

export default router;
