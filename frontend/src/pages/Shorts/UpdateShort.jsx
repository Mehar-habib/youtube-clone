import axios from "axios";
import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaArrowLeft,
  FaTag,
  FaFileAlt,
  FaVideo,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { setAllShortData } from "../../redux/contentSlice";
import { setChannelData } from "../../redux/userSlice";

export default function UpdateShort() {
  const { shortId } = useParams();
  const { channelData } = useSelector((state) => state.user);
  const { allShortsData } = useSelector((state) => state.content);
  const [currentShort, setCurrentShort] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShort = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-short/${shortId}`,
          {
            withCredentials: true,
          },
        );
        setCurrentShort(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTags(res.data.tags?.join(",") || "");
      } catch (error) {
        showCustomAlert(
          error.response?.data?.message || "Failed to fetch short",
          "error",
        );
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchShort();
  }, [shortId, navigate]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      showCustomAlert("Title and description are required", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/content/update-short/${shortId}`,
        {
          title,
          description,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          withCredentials: true,
        },
      );

      const updatedShort = res.data;
      const updatedAllShorts = allShortsData.map((s) =>
        s._id === shortId ? updatedShort : s,
      );
      dispatch(setAllShortData(updatedAllShorts));

      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.map((s) =>
          s._id === shortId ? updatedShort : s,
        ),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short updated successfully", "success");
      navigate(-1);
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Failed to update short",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this short? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/content/delete-short/${shortId}`, {
        withCredentials: true,
      });

      const updatedAllShorts = allShortsData.filter((s) => s._id !== shortId);
      dispatch(setAllShortData(updatedAllShorts));

      const updatedChannel = {
        ...channelData,
        shorts: channelData.shorts.filter((s) => s._id !== shortId),
      };
      dispatch(setChannelData(updatedChannel));

      showCustomAlert("Short deleted successfully", "success");
      navigate("/yt-studio/content");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Failed to delete short",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentShort) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading short details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <FaVideo className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Short</h1>
              <p className="text-gray-400">Update your short details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Video Preview */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <FaVideo className="text-purple-400" />
                </div>
                <h3 className="font-semibold">Short Preview</h3>
              </div>

              {currentShort?.shortUrl && (
                <div className="relative">
                  <video
                    src={currentShort.shortUrl}
                    className="w-full h-96 rounded-lg object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-sm">
                    Short
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Current Title:</span>
                  <span className="text-white font-medium truncate ml-2">
                    {currentShort?.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Views:</span>
                  <span className="text-white">
                    {currentShort?.views?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Uploaded:</span>
                  <span className="text-white">
                    {currentShort?.createdAt
                      ? new Date(currentShort.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                <FaFileAlt />
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter short title"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {title.length}/500
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                <FaFileAlt />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Describe your short"
                rows={4}
                maxLength={10000}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {description.length}/10000
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                <FaTag />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="funny, meme, tutorial (separate with commas)"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {tags
                  .split(",")
                  .filter((tag) => tag.trim())
                  .slice(0, 6)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={handleUpdate}
                disabled={loading || !title.trim() || !description.trim()}
                className="py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaEdit />
                    Update Short
                  </>
                )}
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
              >
                <FaTrash />
                Delete Short
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {currentShort && (
          <div className="mt-6 bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
            <h3 className="font-semibold text-white mb-4">Short Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {currentShort.views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-400">Views</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {currentShort.likes?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {currentShort.comments?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Comments</div>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {currentShort.tags?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Tags</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
