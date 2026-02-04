import { SiYoutubeshorts } from "react-icons/si";
import { FaList } from "react-icons/fa";
import { GoVideo } from "react-icons/go";
import { RiUserCommunityFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import PlaylistCard from "../../components/PlaylistCard";
import PostCard from "../../components/PostCard";

const getVideoDuration = (url, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = url;

  video.onloadedmetadata = () => {
    const totalSeconds = Math.floor(video.duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    callback(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  video.onerror = () => callback("0:00");
};

const Subscription = () => {
  const {
    subscribedChannels,
    subscribedVideos,
    subscribedShorts,
    subscribedPlaylists,
    subscribedPosts,
  } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [duration, setDuration] = useState({});

  useEffect(() => {
    subscribedVideos?.forEach((video) => {
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [subscribedVideos]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 mt-12 lg:mt-5 text-white space-y-10">
      {/* ================= CHANNELS ================= */}
      {subscribedChannels?.length > 0 && (
        <section>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide">
            {subscribedChannels.map((ch) => (
              <div
                key={ch._id}
                onClick={() => navigate(`/channel-page/${ch._id}`)}
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0"
              >
                <img
                  src={ch.avatar}
                  alt={ch.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-700 hover:scale-105 transition"
                />
                <span className="text-xs text-gray-300 truncate max-w-[70px]">
                  {ch.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SHORTS ================= */}
      {subscribedShorts?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <SiYoutubeshorts className="text-red-500" size={28} />
            <h2 className="font-bold text-lg">Subscribed Shorts</h2>
          </div>
          <div className="border border-b border-gray-500" />

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {subscribedShorts.map((short) => (
              <div key={short._id} className="shrink-0">
                <ShortCard
                  shortUrl={short.shortUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  views={short.views}
                  id={short._id}
                  avatar={short.channel?.avatar}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= VIDEOS ================= */}
      {subscribedVideos?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <GoVideo className="text-blue-400" size={28} />
            <h2 className="font-bold text-lg">Subscribed Videos</h2>
          </div>
          <div className="border border-b border-gray-500" />

          <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {subscribedVideos.map((v) => (
              <div key={v._id} className="shrink-0">
                <VideoCard
                  thumbnail={v.thumbnail}
                  duration={duration[v._id] || "0:00"}
                  channelLogo={v.channel?.avatar}
                  title={v.title}
                  channelName={v.channel?.name}
                  views={v.views}
                  id={v._id}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= PLAYLISTS ================= */}
      {subscribedPlaylists?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FaList className="text-green-400" size={24} />
            <h2 className="font-bold text-lg">Subscribed Playlists</h2>
          </div>
          <div className="border border-b border-gray-500" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscribedPlaylists.map((pl) => (
              <PlaylistCard
                key={pl._id}
                id={pl._id}
                title={pl.title}
                videos={pl.videos}
                savedBy={pl.saveBy}
              />
            ))}
          </div>
        </section>
      )}

      {/* ================= POSTS ================= */}
      {subscribedPosts?.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <RiUserCommunityFill className="text-purple-400" size={28} />
            <h2 className="font-bold text-lg">Community Posts</h2>
          </div>
          <div className="border border-b border-gray-500" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subscribedPosts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Subscription;
