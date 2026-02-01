import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import VideoCard from "../../components/VideoCard";
import PlaylistCard from "../../components/PlaylistCard";
import PostCard from "../../components/PostCard";
import ShortCard from "../../components/ShortCard";

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

export default function ChannelPage() {
  const { channelId } = useParams();
  const { allChannelData, userData } = useSelector((state) => state.user);
  const channelData =
    allChannelData?.find((channel) => channel._id === channelId) || null;

  const [channel, setChannel] = useState(channelData);
  const [isSubscribed, setIsSubscribed] = useState(
    channel?.subscribers?.some(
      (sub) =>
        sub._id?.toString() === userData._id?.toString() ||
        sub?.toString() === userData._id?.toString(),
    ),
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(channel?.videos) && channel?.videos.length > 0) {
      channel.videos.forEach((video) => {
        getVideoDuration(video.videoUrl, (time) => {
          setDuration((prev) => ({ ...prev, [video._id]: time }));
        });
      });
    }
  }, [channel?.videos]);

  const handleSubscribe = async () => {
    if (!channel._id) return;
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/toggle-subscribe",
        { channelId: channel._id },
        { withCredentials: true },
      );
      setChannel((prev) => ({
        ...prev,
        subscribers: result.data.subscribers || prev.subscribers,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) =>
          sub._id?.toString() === userData._id?.toString() ||
          sub?.toString() === userData._id?.toString(),
      ),
    );
  }, [channel?.subscribers, userData?._id]);

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      {/* Banner */}
      <div className="relative h-60 md:h-72">
        <img
          src={channel?.banner}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-4 -mt-14 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <img
            src={channel?.avatar}
            alt=""
            className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] shadow-xl"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{channel?.name}</h1>
            <p className="text-gray-400 mt-1 text-sm">
              {channel?.subscribers?.length} subscribers •{" "}
              {channel?.videos?.length} videos
            </p>
            <p className="text-gray-500 text-sm mt-1">{channel?.category}</p>
          </div>

          <button
            disabled={loading}
            onClick={handleSubscribe}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              isSubscribed
                ? "bg-[#1f1f1f] text-white hover:bg-red-600"
                : "bg-white text-black hover:bg-red-600 hover:text-white"
            }`}
          >
            {loading ? "Loading..." : isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-10 border-b border-gray-800 flex gap-8 overflow-x-auto">
          {["Videos", "Shorts", "Playlists", "Community"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 relative text-sm font-medium transition ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="py-8">
          {activeTab === "Videos" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {channel?.videos?.map((v) => (
                <VideoCard
                  key={v._id}
                  id={v._id}
                  thumbnail={v.thumbnail}
                  duration={duration[v._id] || "0:00"}
                  title={v.title}
                  channelLogo={channel.avatar}
                  channelName={channel.name}
                  views={v.views}
                />
              ))}
            </div>
          )}

          {activeTab === "Shorts" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {channel?.shorts?.map((s) => (
                <ShortCard
                  key={s._id}
                  id={s._id}
                  shortUrl={s.shortUrl}
                  title={s.title}
                  avatar={channel.avatar}
                  channelName={channel.name}
                  views={s.views}
                />
              ))}
            </div>
          )}

          {activeTab === "Playlists" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {channel?.playlists?.map((p) => (
                <PlaylistCard
                  key={p._id}
                  id={p._id}
                  title={p.title}
                  videos={p.videos}
                  savedBy={p.savedBy}
                />
              ))}
            </div>
          )}

          {activeTab === "Community" && (
            <div className="max-w-3xl space-y-4">
              {channel?.communityPosts?.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
