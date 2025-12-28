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

export const getChannelData = async (req, res) => {
  try {
    const userId = req.userId;
    const channel = await Channel.findById({ owner: userId }).populate("owner");

    if (!channel) {
      return res.status(400).json({ message: "Channel not found" });
    }
    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
