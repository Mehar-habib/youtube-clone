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
      { new: true }
    );
    return res.status(200).json(newShort);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .sort({ createdAt: -1 })
      .populate("channel");
    if (!shorts) {
      return res.status(400).json({ message: "Shorts not found" });
    }
    return res.status(200).json(shorts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
