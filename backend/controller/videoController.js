import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";
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
      req.files.thumbnail[0].path,
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
      { new: true },
    );

    return res.status(201).json(newVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId)
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, tags } = req.body;

    // find video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    // update fields if provided
    if (title) video.title = title;
    if (description) video.description = description;

    // parse tag is sent
    if (tags) {
      try {
        video.tags = JSON.parse(tags);
      } catch (error) {
        video.tags = [];
      }
    }
    // if new thumbnail uploaded (single file)
    if (req.file) {
      const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
      video.thumbnail = uploadedThumbnail;
    }
    await video.save();

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    // find video
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    // remove video reference from channel
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });
    // delete video document
    await Video.findByIdAndDelete(videoId);
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("channel comments.replies.author comments.author");
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
      { new: true },
    );
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    video.comments.push({ author: userId, message });
    await video.save();
    const populatedVideo = await Video.findById(videoId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      });
    return res.status(200).json(populatedVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addReply = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(400).json({ message: "Video not found" });
    }
    const comment = await video.comments.id(commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    comment.replies.push({ author: userId, message });
    video.save();
    const populatedVideo = await Video.findById(videoId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      });
    return res.status(200).json(populatedVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLikedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const likedVideo = await Video.find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "username");
    if (!likedVideo) {
      return res.status(400).json({ message: "Videos not found" });
    }
    return res.status(200).json(likedVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLikedShorts = async (req, res) => {
  try {
    const userId = req.userId;
    const likedShort = await Short.find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "username");
    if (!likedShort) {
      return res.status(400).json({ message: "Short not found" });
    }
    return res.status(200).json(likedShort);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSavedVideos = async (req, res) => {
  try {
    const userId = req.userId;
    const savedVideo = await Video.find({ saveBy: userId })
      .populate("channel", "name avatar")
      .populate("saveBy", "username");
    if (!savedVideo) {
      return res.status(400).json({ message: "Videos not found" });
    }
    return res.status(200).json(savedVideo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
