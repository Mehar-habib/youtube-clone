import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaList,
  FaArrowLeft,
  FaVideo,
  FaPlus,
} from "react-icons/fa";
import { showCustomAlert } from "../../components/CustomAlert";

export default function UpdatePlaylist() {
  const { playlistId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-playlist/${playlistId}`,
          {
            withCredentials: true,
          },
        );
        setPlaylist(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setSelectedVideos(res.data.videos.map((v) => v._id));
      } catch (error) {
        showCustomAlert(
          error.response?.data?.message || "Failed to fetch playlist",
          "error",
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId, navigate]);

  useEffect(() => {
    if (channelData?.videos) {
      setVideoData(channelData.videos);
    }
  }, [channelData]);

  const toggleVideoSelect = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId],
    );
  };

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      showCustomAlert("Title and description are required", "error");
      return;
    }

    if (selectedVideos.length === 0) {
      showCustomAlert("Please select at least one video", "error");
      return;
    }

    setLoading(true);
    try {
      const currentVideos = playlist.videos.map((v) => v._id.toString());
      const newVideos = selectedVideos.map((v) => v.toString());
      const addVideos = newVideos.filter((v) => !currentVideos.includes(v));
      const removeVideos = currentVideos.filter((v) => !newVideos.includes(v));

      const res = await axios.post(
        `${serverUrl}/api/content/update-playlist/${playlistId}`,
        {
          title,
          description,
          addVideos,
          removeVideos,
        },
        {
          withCredentials: true,
        },
      );

      const updatedPlaylists = channelData.playlists.map((p) =>
        p._id === playlistId ? res.data : p,
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));
      showCustomAlert("Playlist updated successfully", "success");
      navigate(-1);
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    try {
      await axios.delete(
        `${serverUrl}/api/content/delete-playlist/${playlistId}`,
        {
          withCredentials: true,
        },
      );

      const updatedPlaylists = channelData.playlists.filter(
        (p) => p._id !== playlistId,
      );
      dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));
      showCustomAlert("Playlist deleted successfully", "success");
      navigate("/yt-studio/content");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Failed to delete playlist",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <FaList className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Playlist</h1>
              <p className="text-gray-400">Update your playlist details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Playlist Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                    <FaEdit />
                    Playlist Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Enter playlist title"
                    maxLength={100}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {title.length}/100
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                    <FaEdit />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors resize-none"
                    placeholder="Describe your playlist"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {description.length}/500
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Selection */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FaVideo className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Select Videos</h3>
                    <p className="text-sm text-gray-400">
                      Choose videos for your playlist
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {selectedVideos.length} selected
                </div>
              </div>

              {videoData.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-xl">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <FaVideo className="text-2xl text-gray-500" />
                  </div>
                  <p className="text-gray-400">No videos available</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Upload videos to create playlists
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2">
                  {videoData.map((video) => {
                    const selected = selectedVideos.includes(video._id);
                    return (
                      <div
                        key={video._id}
                        onClick={() => toggleVideoSelect(video._id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border transition-all group ${
                          selected
                            ? "border-green-500 bg-green-500/10"
                            : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/30"
                        }`}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {selected && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <FaCheckCircle className="text-white text-xs" />
                            </div>
                          )}
                        </div>

                        <div className="p-2">
                          <p className="text-xs font-medium text-white line-clamp-2">
                            {video.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {video.views?.toLocaleString() || 0} views
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <h3 className="font-semibold text-white mb-4">Playlist Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Current Videos</span>
                  <span className="font-semibold">
                    {playlist?.videos?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Selected Videos</span>
                  <span className="font-semibold text-green-400">
                    {selectedVideos.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Created</span>
                  <span className="font-semibold">
                    {playlist?.createdAt
                      ? new Date(playlist.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-800">
                  <div className="text-sm text-gray-400">Changes:</div>
                  <div className="text-xs text-gray-300 mt-1">
                    {selectedVideos.length - (playlist?.videos?.length || 0) > 0
                      ? "+"
                      : ""}
                    {selectedVideos.length - (playlist?.videos?.length || 0)}{" "}
                    videos
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpdate}
                disabled={
                  loading ||
                  !title.trim() ||
                  !description.trim() ||
                  selectedVideos.length === 0
                }
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Update Playlist
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaTrash />
                Delete Playlist
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedVideos(videoData.map((v) => v._id))}
                  className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Select All Videos
                </button>
                <button
                  onClick={() => setSelectedVideos([])}
                  className="w-full text-sm text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
