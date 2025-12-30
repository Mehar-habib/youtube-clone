import axios from "axios";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { useNavigate } from "react-router-dom";

export default function CreateShorts() {
  const { channelData } = useSelector((state) => state.user);

  const [shortUrl, setShortUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUploadShort = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((tag) => tag.trim()))
    );
    formData.append("shortUrl", shortUrl);
    formData.append("channelId", channelData._id);

    try {
      await axios.post(serverUrl + "/api/content/create-short", formData, {
        withCredentials: true,
      });
      showCustomAlert("Short uploaded successfully", "success");
      navigate("/");
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT – Video Upload */}
        <label className="border-2 border-dashed border-gray-600 rounded-xl flex flex-col justify-center items-center cursor-pointer hover:border-red-500 transition p-6">
          {shortUrl ? (
            <video
              src={URL.createObjectURL(shortUrl)}
              controls
              className="rounded-lg w-full max-h-[420px] object-cover"
            />
          ) : (
            <>
              <FaCloudUploadAlt className="text-5xl text-red-500 mb-3" />
              <p className="font-semibold text-lg">Upload Short Video</p>
              <span className="text-gray-400 text-sm mt-1">
                MP4 / MOV • Max 60 seconds
              </span>
            </>
          )}
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            className="hidden"
            onChange={(e) => setShortUrl(e.target.files[0])}
          />
        </label>

        {/* RIGHT – Form */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Create a Short</h2>
          <p className="text-gray-400 text-sm">
            Add details to help viewers discover your short
          </p>

          <input
            type="text"
            placeholder="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#2a2a2a] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <textarea
            placeholder="Description*"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#2a2a2a] px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Tags* (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-[#2a2a2a] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            disabled={!title || !description || !tags || !shortUrl || loading}
            onClick={handleUploadShort}
            className={`mt-3 py-3 rounded font-semibold transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Short"}
          </button>

          {loading && (
            <p className="text-gray-400 text-sm text-center animate-pulse">
              Short uploading... please wait
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
