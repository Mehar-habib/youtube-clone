import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Short from "../model/shortModel.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description required" });
    }
    let shortUrl;
    if (req.file) {
      shortUrl = await uploadOnCloudinary(req.file.path);
    }
    const channelData = await Channel.findById(channelId);
    if (!channelData) {
      return res.status(400).json({ message: "Channel not found" });
    }
    const newShort = await Short.create({
      title,
      description,
      tags: tags ? JSON.parse(tags) : [],
      channel: channelData._id,
      shortUrl,
    });
    await Channel.findByIdAndUpdate(
      channelData._id,
      { $push: { shorts: newShort._id } },
      { new: true },
    );
    return res.status(200).json(newShort);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const fetchShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Short.findById(shortId)
      .populate("channel", "name avatar")
      .populate("likes", "userName photoUrl");
    if (!short) {
      return res.status(400).json({ message: "Short not found" });
    }
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { title, description, tags } = req.body;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "Short not found" });
    }
    if (title) short.title = title;
    if (description) short.description = description;
    if (tags) {
      try {
        short.tags = JSON.parse(tags);
      } catch (error) {
        short.tags = [];
      }
    }
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteShort = async (req, res) => {
  try {
    const { shortId } = req.params;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "Short not found" });
    }
    // remove reference from channel
    await Channel.findByIdAndUpdate(short.channel, {
      $pull: { shorts: short._id },
    });
    await Short.findByIdAndDelete(shortId);
    return res.status(200).json({ message: "Short deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel comments.author comments.replies.author");
    if (!shorts) {
      return res.status(400).json({ message: "Shorts not found" });
    }
    return res.status(200).json(shorts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleLikesForShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    if (short.likes.includes(userId)) {
      short.likes.pull(userId);
    } else {
      short.likes.push(userId);
      short.disLikes.pull(userId);
    }
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleDisLikesForShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    if (short.disLikes.includes(userId)) {
      short.disLikes.pull(userId);
    } else {
      short.disLikes.push(userId);
      short.likes.pull(userId);
    }
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSaveForShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    if (short.saveBy.includes(userId)) {
      short.saveBy.pull(userId);
    } else {
      short.saveBy.push(userId);
    }
    await short.populate("channel");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getViewsForShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const short = await Short.findByIdAndUpdate(
      shortId,
      {
        $inc: { views: 1 },
      },
      { new: true },
    );
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addCommentForShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    short.comments.push({ author: userId, message });
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addReplyForShort = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) {
      return res.status(400).json({ message: "short not found" });
    }
    const comment = await short.comments.id(commentId);
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    comment.replies.push({ author: userId, message });
    await short.save();
    await short.populate("comments.author", "userName photoUrl");
    await short.populate("channel");
    await short.populate("comments.replies.author", "userName photoUrl");
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSavedShorts = async (req, res) => {
  try {
    const userId = req.userId;
    const savedShort = await Short.find({ saveBy: userId })
      .populate("channel", "name avatar")
      .populate("saveBy", "username");
    if (!savedShort) {
      return res.status(400).json({ message: "Short not found" });
    }
    return res.status(200).json(savedShort);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
