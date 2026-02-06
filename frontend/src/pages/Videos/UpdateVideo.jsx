import axios from "axios";
import { useState, useEffect } from "react";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUpload,
  FaEdit,
  FaTrash,
  FaImage,
  FaTag,
  FaFileAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { setAllVideosData } from "../../redux/contentSlice";

export default function UpdateVideo() {
  const { videoId } = useParams();
  const { allVideosData } = useSelector((state) => state.content);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/content/fetch-video/${videoId}`,
          { withCredentials: true },
        );
        setCurrentVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setTags(res.data.tags?.join(",") || "");
      } catch (error) {
        console.error(error);
        showCustomAlert(
          error.response?.data?.message || "Failed to fetch video",
          "error",
        );
        navigate("/");
      }
    };
    fetchVideo();
  }, [videoId, navigate]);

  const handleThumbnail = (e) => setThumbnail(e.target.files[0]);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      showCustomAlert("Title and description are required", "error");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim())),
      );
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const result = await axios.post(
        `${serverUrl}/api/content/update-video/${videoId}`,
        formData,
        { withCredentials: true },
      );

      const updateVideos = allVideosData.map((v) =>
        v._id === videoId ? result.data : v,
      );
      dispatch(setAllVideosData(updateVideos));
      showCustomAlert("Video updated successfully!", "success");
      navigate(-1);
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Update failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone.",
      )
    )
      return;
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/api/content/delete-video/${videoId}`, {
        withCredentials: true,
      });
      dispatch(
        setAllVideosData(allVideosData.filter((v) => v._id !== videoId)),
      );
      showCustomAlert("Video deleted successfully", "success");
      navigate("/");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Delete failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
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
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FaEdit className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Video</h1>
              <p className="text-gray-400">Update your video details</p>
            </div>
          </div>
        </div>

        {/* Form */}
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
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter video title"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {title.length}/100
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
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe your video"
              rows={5}
              maxLength={5000}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {description.length}/5000
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
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="gaming, tutorial, vlog (separate with commas)"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags
                .split(",")
                .filter((tag) => tag.trim())
                .slice(0, 8)
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

          {/* Thumbnail Upload */}
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
              <FaImage />
              Thumbnail
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnail}
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                {thumbnail ? (
                  <div className="space-y-3">
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="Thumbnail preview"
                      className="w-48 h-32 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-400">
                      Click to change thumbnail
                    </p>
                  </div>
                ) : currentVideo?.thumbnail ? (
                  <div className="space-y-3">
                    <img
                      src={currentVideo.thumbnail}
                      alt="Current thumbnail"
                      className="w-48 h-32 mx-auto rounded-lg object-cover"
                    />
                    <p className="text-sm text-gray-400">
                      Click to change thumbnail
                    </p>
                  </div>
                ) : (
                  <>
                    <FaImage className="text-4xl text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">Click to upload thumbnail</p>
                    <p className="text-sm text-gray-500 mt-1">
                      1280x720px recommended
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={handleUpdate}
              disabled={loading || !title.trim() || !description.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaUpload />
                  Update Video
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              <FaTrash />
              Delete Video
            </button>
          </div>
        </div>

        {/* Preview Info */}
        {currentVideo && (
          <div className="mt-6 bg-[#1a1a1a] rounded-xl border border-gray-800 p-4">
            <h3 className="font-medium text-gray-300 mb-2">
              Current Video Info
            </h3>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Views: {currentVideo.views?.toLocaleString() || 0}</div>
              <div>
                Uploaded:{" "}
                {new Date(currentVideo.createdAt).toLocaleDateString()}
              </div>
              <div>Likes: {currentVideo.likes?.length || 0}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
