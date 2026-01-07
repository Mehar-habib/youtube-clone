import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";

export const createVideo = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;
    if (!title || !req.files.video || !req.files.thumbnail || !channelId) {
      return res
        .status(400)
        .json({ message: "title, video, thumbnail and channelId required" });
    }
    const channelData = await Channel.findById(channelId);
    if (!channelData) {
      return res.status(400).json({ message: "Channel not found" });
    }
    const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
    const uploadThumbnail = await uploadOnCloudinary(
      req.files.thumbnail[0].path
    );

    let parsedTag = [];
    if (tags) {
      try {
        parsedTag = JSON.parse(tags);
      } catch (error) {
        parsedTag = [];
      }
    }

    const newVideo = await Video.create({
      title,
      channel: channelData._id,
      description,
      tags: parsedTag,
      videoUrl: uploadVideo,
      thumbnail: uploadThumbnail,
    });

    await Channel.findByIdAndUpdate(
      channelData._id,
      {
        $push: { videos: newVideo._id },
      },
      { new: true }
    );

    return res.status(201).json(newVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("channel");
    if (!videos) {
      return res.status(400).json({ message: "Videos not found" });
    }
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    if (video.likes.includes(userId)) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.disLikes.pull(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleDisLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    if (video.disLikes.includes(userId)) {
      video.disLikes.pull(userId);
    } else {
      video.disLikes.push(userId);
      video.likes.pull(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSave = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    if (video.saveBy.includes(userId)) {
      video.saveBy.pull(userId);
    } else {
      video.saveBy.push(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getViews = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { views: 1 },
      },
      { new: true }
    );
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
