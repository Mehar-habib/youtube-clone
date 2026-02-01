import { useState } from "react";
import { FaBookmark, FaListUl, FaTimes } from "react-icons/fa";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

const PlaylistCard = ({ id, title, videos = [], savedBy = [] }) => {
  const thumbnail = videos[0]?.thumbnail;
  const [showVideos, setShowVideos] = useState(false);
  const { userData } = useSelector((state) => state.user);

  const [isSaved, setIsSaved] = useState(
    savedBy?.some((uid) => uid?.toString() === userData?._id?.toString()) ||
      false,
  );

  const handleSave = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/playlist/toggle-save`,
        { playlistId: id },
        { withCredentials: true },
      );
      const updated = result.data.saveBy?.some(
        (uid) => uid.toString() === userData._id.toString(),
      );
      setIsSaved(updated);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* ================= PLAYLIST CARD ================= */}
      <div className="relative w-full max-w-[260px] aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-lg group cursor-pointer">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-gray-300 mt-1">{videos.length} videos</p>
        </div>

        {/* save button */}
        <button
          onClick={handleSave}
          className={`absolute top-3 right-3 p-2 rounded-full border border-gray-700 backdrop-blur transition
            ${
              isSaved
                ? "bg-red-600 text-white shadow-lg scale-105 hover:bg-red-700"
                : "bg-black/60 text-white border border-gray-600 hover:bg-black"
            }`}
        >
          <FaBookmark size={14} />
        </button>

        {/* open playlist */}
        <button
          onClick={() => setShowVideos(true)}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
        >
          <FaListUl size={14} />
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showVideos && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div
            className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto
            rounded-2xl bg-gradient-to-br from-[#0f0f0f] via-black to-[#0f0f0f]
            border border-gray-800 shadow-2xl p-6"
          >
            {/* close */}
            <button
              onClick={() => setShowVideos(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <FaTimes size={22} />
            </button>

            {/* header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {videos.length} videos in this playlist
              </p>
              <div className="h-[3px] bg-red-600 rounded-full mt-3" />
            </div>

            {/* videos grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {videos.map((v) => (
                <VideoCard
                  key={v._id}
                  id={v._id}
                  thumbnail={v.thumbnail}
                  channelLogo={v.channel?.avatar}
                  title={v.title}
                  channelName={v.channel?.name}
                  views={v.views}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaylistCard;
