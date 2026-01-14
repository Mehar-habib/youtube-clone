import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { showCustomAlert } from "../../components/CustomAlert";

export default function CreatePlaylist() {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleCreatePlaylist = async () => {
    if (selectedVideos.length === 0) {
      showCustomAlert("Please select at least one video", "error");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/content/create-playlist",
        {
          title,
          description,
          videoIds: selectedVideos,
          channelId: channelData._id,
        },
        { withCredentials: true }
      );

      const updateChannel = {
        ...channelData,
        playlists: [...(channelData.playlists || []), result.data],
      };

      dispatch(setChannelData(updateChannel));
      showCustomAlert("Playlist created successfully", "success");
      navigate("/");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (channelData?.videos) {
      setVideoData(channelData.videos);
    }
  }, [channelData]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-[#181818] rounded-2xl shadow-xl border border-gray-800 p-6 md:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Create New Playlist</h1>
          <p className="text-gray-400 text-sm mt-1">
            Organize your videos into a playlist for your audience
          </p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Playlist Title</label>
          <input
            type="text"
            placeholder="Enter playlist title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            placeholder="Write a short description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Videos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Select Videos</h2>
            <span className="text-xs text-gray-400">
              {selectedVideos.length} selected
            </span>
          </div>

          {videoData.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border border-dashed border-gray-700 rounded-lg">
              No videos found for this channel
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-1">
              {videoData.map((video) => {
                const selected = selectedVideos.includes(video._id);
                return (
                  <div
                    key={video._id}
                    onClick={() => toggleVideoSelect(video._id)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border transition
                      ${
                        selected
                          ? "border-red-500"
                          : "border-gray-700 hover:border-gray-500"
                      }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="w-full h-32 object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition" />

                    {selected && (
                      <FaCheckCircle className="absolute top-2 right-2 text-red-500 text-xl bg-black rounded-full" />
                    )}

                    <div className="p-2 text-xs line-clamp-2">
                      {video.title}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action */}
        <button
          disabled={!title || !description || loading}
          onClick={handleCreatePlaylist}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
        >
          <FaPlus />
          {loading ? "Creating..." : "Create Playlist"}
        </button>
      </div>
    </div>
  );
}
