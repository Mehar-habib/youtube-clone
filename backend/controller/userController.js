import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "User already has a channel" });
    }
    const nameExist = await Channel.findOne({ name });
    if (nameExist) {
      return res.status(400).json({ message: "Channel name already exist" });
    }
    let avatar;
    let banner;
    if (req.files?.avatar) {
      avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    }
    if (req.files?.banner) {
      banner = await uploadOnCloudinary(req.files.banner[0].path);
    }
    const channel = await Channel.create({
      name,
      description,
      category,
      owner: userId,
      avatar,
      banner,
    });
    await User.findByIdAndUpdate(userId, {
      channel: channel._id,
      userName: name,
      photoUrl: avatar,
    });
    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    if (name && name !== channel.name) {
      const nameExist = await Channel.findOne({ name });
      if (nameExist) {
        return res.status(400).json({ message: "Channel name already exist" });
      }
      channel.name = name;
    }
    if (description !== undefined) {
      channel.description = description;
    }
    if (category !== undefined) {
      channel.category = category;
    }
    if (req.files?.avatar) {
      const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
      channel.avatar = avatar;
    }
    if (req.files?.banner) {
      const banner = await uploadOnCloudinary(req.files.banner[0].path);
      channel.banner = banner;
    }
    const updatedChannel = await channel.save();
    await User.findByIdAndUpdate(userId, {
      userName: name || undefined,
      photoUrl: channel.avatar || undefined,
    });
    return res.status(200).json(updatedChannel);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getChannelData = async (req, res) => {
  try {
    const userId = req.userId;
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")
      .populate("videos")
      .populate("shorts");

    if (!channel) {
      return res.status(400).json({ message: "Channel not found" });
    }
    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSubscriber = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId;
    if (!channelId) {
      return res.status(400).json({ message: "Channel id required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(400).json({ message: "Channel not found" });
    }
    const isSubscribed = channel?.subscribers?.includes(userId);
    if (isSubscribed) {
      channel?.subscribers.pull(userId);
    } else {
      channel?.subscribers.push(userId);
    }
    await channel.save();
    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("videos")
      .populate("shorts");
    return res.status(200).json(updatedChannel);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllChannelData = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner")
      .populate("videos")
      .populate("shorts")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        populate: [
          {
            path: "channel",
            model: "Channel",
          },
          {
            path: "comments.author",
            model: "User",
            select: "userName photoUrl",
          },
          {
            path: "comments.replies.author",
            model: "User",
            select: "userName photoUrl",
          },
        ],
      })
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });
    if (!channels) {
      return res.status(400).json({ message: "Channels not found" });
    }
    return res.status(200).json(channels);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
