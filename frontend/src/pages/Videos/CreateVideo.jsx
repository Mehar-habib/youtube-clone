import axios from "axios";
import { useState } from "react";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";

export default function CreateVideo() {
  const { channelData } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVideo = (e) => setVideoUrl(e.target.files[0]);
  const handleThumbnail = (e) => setThumbnail(e.target.files[0]);

  const handleUploadVideo = async () => {
    if (!title || !description || !tags || !thumbnail || !videoUrl) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("thumbnail", thumbnail);
    formData.append("video", videoUrl);
    formData.append("channelId", channelData._id);

    try {
      const result = await axios.post(
        serverUrl + "/api/content/create-video",
        formData,
        { withCredentials: true }
      );
      console.log(result);
      showCustomAlert("Video uploaded successfully", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response?.data?.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-[#1a1a1a] rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Upload New Video
        </h1>
        <p className="text-gray-400 text-center">
          Add a title, description, tags, and upload your video & thumbnail
        </p>

        {/* Video Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-red-600 transition">
          <FaUpload className="text-red-500 text-4xl mb-2" />
          <span className="text-gray-400 text-center">
            {videoUrl ? videoUrl.name : "Click to upload video"}
          </span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideo}
          />
        </label>

        {/* Title */}
        <input
          type="text"
          placeholder="Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Description */}
        <textarea
          placeholder="Description*"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={4}
        />

        {/* Tags */}
        <input
          type="text"
          placeholder="Tags* (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 rounded bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Thumbnail Upload */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-red-600 transition">
          {thumbnail ? (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="thumbnail"
              className="w-40 h-28 object-cover rounded-lg mb-2"
            />
          ) : (
            <span className="text-gray-400 text-center">
              Click to upload thumbnail
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnail}
          />
        </label>

        {/* Upload Button */}
        <button
          disabled={
            !title ||
            !description ||
            !tags ||
            !thumbnail ||
            !videoUrl ||
            loading
          }
          onClick={handleUploadVideo}
          className={`w-full py-3 rounded font-semibold text-white transition ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>

        {loading && (
          <p className="text-center text-gray-400 animate-pulse">
            Uploading... please wait
          </p>
        )}
      </div>
    </div>
  );
}
