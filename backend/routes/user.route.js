import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createChannel,
  getAllChannelData,
  getChannelData,
  getCurrentUser,
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

export default router;
