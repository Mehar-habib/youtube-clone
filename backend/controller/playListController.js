import Channel from "../model/channelModel.js";
import Playlist from "../model/playlistModel.js";
import Video from "../model/videoModel.js";

export const CreatePlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds } = req.body;
    if (!title || !channelId) {
      return res.status(400).json({ message: "title and channelId required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(400).json({ message: "Channel not found" });
    }
    const videos = await Video.find({
      _id: { $in: videoIds },
      channel: channelId,
    });
    if (videos.length !== videoIds.length) {
      return res.status(400).json({ message: "some videos are not found" });
    }
    const playlist = await Playlist.create({
      title,
      description,
      channel: channelId,
      videos: videoIds,
    });
    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSavePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.userId;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(400).json({ message: "playlist not found" });
    }
    if (playlist.saveBy.includes(userId)) {
      playlist.saveBy.pull(userId);
    } else {
      playlist.saveBy.push(userId);
    }
    await playlist.save();
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
