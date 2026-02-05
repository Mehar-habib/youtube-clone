import { GoogleGenAI } from "@google/genai";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";
import Short from "../model/shortModel.js";
import Playlist from "../model/playlistModel.js";

export const searchWithAi = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Search query is required" });
    }
    // Ai sa keyword niklo (autocorrect + simplified)
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const prompt = `you are a search assistant for a video streaming platform. the user query is : "${input}" 

        your job:
        - if query has typos, correct them.
        - if query has multiple words, break them into meaningful keywords.
        - Return only the correct word(s), comma separated.
        - Do not explain, only return keywords(s).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    let keyword = (response.text || input).trim().replace(/[\n\r]+/g, "");

    const searchWords = keyword
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    const buildRegexQuery = (fields) => {
      return {
        $or: searchWords.map((word) => ({
          $or: fields.map((field) => ({
            [field]: { $regex: word, $options: "i" },
          })),
        })),
      };
    };
    // channels
    const matchedChannels = await Channel.find(
      buildRegexQuery(["name"]),
    ).select("_id name avatar");
    const channelIds = matchedChannels.map((c) => c._id);

    // videos
    const videos = await Video.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel comments.author comments.replies.author");

    // short
    const shorts = await Short.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");

    // Playlists
    const playlists = await Playlist.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
      });

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    console.error("Search API Error:", error);

    // Gemini / Google AI rate limit
    if (error?.status === 429 || error?.code === 429) {
      return res.status(429).json({
        message: "AI rate limit reached. Please try again after a moment.",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
