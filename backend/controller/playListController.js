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

export const fetchPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId)
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      });
    if (!playlist) {
      return res.status(400).json({ message: "Playlist not found" });
    }
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, addVideos = [], removeVideos = [] } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(400).json({ message: "Playlist not found" });
    }
    // update title and description
    if (title) playlist.title = title;
    if (description) playlist.description = description;

    // Add videos (Avoid duplicates)
    playlist.videos.push(...addVideos);
    playlist.videos = [
      ...new Set(playlist.videos.map((video) => video.toString())),
    ];

    // Remove videos
    playlist.videos = playlist.videos.filter(
      (video) => !removeVideos.includes(video.toString()),
    );

    await playlist.save();
    return res.status(200).json(playlist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(400).json({ message: "Playlist not found" });
    }
    // remove playlist reference from channel
    await Channel.findByIdAndUpdate(playlist.channel, {
      $pull: { playlists: playlist._id },
    });
    // delete playlist
    await Playlist.findByIdAndDelete(playlistId);
    return res.status(200).json({ message: "Playlist deleted successfully" });
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

export const getSavedPlaylist = async (req, res) => {
  try {
    const userId = req.userId;
    const savedPlaylist = await Playlist.find({ saveBy: userId })
      .populate("videos")
      .populate({
        path: "videos",
        populate: { path: "channel" },
      });
    if (!savedPlaylist) {
      return res.status(400).json({ message: "Playlist not found" });
    }
    return res.status(200).json(savedPlaylist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
