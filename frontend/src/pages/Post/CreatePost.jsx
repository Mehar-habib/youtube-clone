import { useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { showCustomAlert } from "../../components/CustomAlert";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { setChannelData } from "../../redux/userSlice";

export default function CreatePost() {
  const { channelData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!content) {
      showCustomAlert("Please write something", "error");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    formData.append("channelId", channelData._id);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/content/create-post",
        formData,
        { withCredentials: true }
      );

      const updateChannel = {
        ...channelData,
        posts: [...(channelData.posts || []), result.data],
      };

      dispatch(setChannelData(updateChannel));
      showCustomAlert("Post created successfully", "success");
      navigate("/");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Error creating post",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#181818] border border-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6 text-white">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Create Community Post</h1>
          <p className="text-sm text-gray-400 mt-1">
            Share updates, images, or thoughts with your community
          </p>
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Write something for your community..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full bg-[#0f0f0f] border border-gray-700 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
        />

        {/* Image Upload */}
        <div className="flex items-center justify-between">
          <label
            htmlFor="image"
            className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white transition"
          >
            <FaImage className="text-lg" />
            Add Image (optional)
            <input
              type="file"
              id="image"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {image && (
            <button
              onClick={() => setImage(null)}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500"
            >
              <FaTimes />
              Remove
            </button>
          )}
        </div>

        {/* Image Preview */}
        {image && (
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full max-h-80 object-cover rounded-xl border border-gray-700"
            />
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!content || loading}
          onClick={handleCreatePost}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </div>
    </div>
  );
}
