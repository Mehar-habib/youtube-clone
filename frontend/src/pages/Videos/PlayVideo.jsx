import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBackward,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { SiYoutubestudio } from "react-icons/si";
import ShortCard from "../../components/ShortCard";
import Description from "../../components/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import { setChannelData } from "../../redux/userSlice";
import { setAllVideosData } from "../../redux/contentSlice";

const IconButton = ({ icon: Icon, active, label, count, onClick }) => {
  <button onClick={onClick}>
    <div
      className={`${
        active ? "bg-white" : "bg-[#00000065] border border-gray-700"
      } p-3 rounded-full hover:bg-gray-700 transition`}
    >
      <Icon className={`${active ? "text-black" : "text-white"}`} />
    </div>
    <span className="text-xs mt-1 flex gap-1">
      {count !== undefined && ` (${count})`} <span>{label}</span>
    </span>
  </button>;
};
export default function PlayVideo() {
  const { userData } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [vol, setVol] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    channel?.subscribers?.some(
      (sub) =>
        sub._id?.toString() === userData._id?.toString() ||
        sub?.toString() === userData._id?.toString()
    )
  );

  const { videoId } = useParams();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { allVideosData, allShortsData } = useSelector(
    (state) => state.content
  );
  const dispatch = useDispatch();

  const suggestedVideos =
    allVideosData?.filter((video) => video._id !== videoId).slice(0, 10) || [];
  const suggestedShorts = allShortsData?.slice(0, 10) || [];

  useEffect(() => {
    if (!allVideosData) {
      return;
    }
    const currentVideo = allVideosData?.find((v) => v._id === videoId);
    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
    }
    const addViews = async () => {
      try {
        const result = await axios.put(
          `${serverUrl}/api/content/video/${videoId}/add-view`,
          {},
          { withCredentials: true }
        );
        setVideo((prev) =>
          prev ? { ...prev, views: result.data.views } : prev
        );
        const updatedVideo = allVideosData.map((v) =>
          v._id === videoId ? { ...v, views: result.data.views } : v
        );
        dispatch(setAllVideosData(updatedVideo));
      } catch (error) {
        console.log(error);
      }
    };
    addViews();
  }, []);

  const handleUpdateTime = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration);
    setProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100
    );
  };
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };
  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };
  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };
  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVol(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };
  const handleMute = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };
  const handleFullScreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };
  const handleSubscribe = async () => {
    if (!channel._id) return;
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/toggle-subscribe",
        { channelId: channel._id },
        { withCredentials: true }
      );
      setChannel((prev) => ({
        ...prev,
        subscribers: result.data.subscribers || prev.subscribers,
      }));

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setIsSubscribed(
      channel?.subscribers?.some(
        (sub) =>
          sub._id?.toString() === userData._id?.toString() ||
          sub?.toString() === userData._id?.toString()
      )
    );
  }, [channel?.subscribers, userData?._id]);
  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          {/* Video Player */}
          <video
            src={video?.videoUrl}
            controls={false}
            autoPlay
            ref={videoRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleUpdateTime}
            className="w-full h-full object-contain"
          />
          {showControls && (
            <div className="absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20">
              <button
                onClick={skipBackward}
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-red-500 transition"
              >
                <FaBackward size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-red-500 transition"
              >
                {isPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                onClick={skipForward}
                className="bg-black/70 p-3 sm:p-4 rounded-full hover:bg-red-500 transition"
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
          {/* video progress   */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30">
            <input
              type="range"
              min={0}
              max={100}
              onChange={handleSeek}
              value={progress}
              className="w-full accent-red-500"
            />
            {/* for mobile */}
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
              {/* left */}
              <div className="flex items-center gap-3">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button
                  onClick={skipBackward}
                  className="bg-black/70 px-2 py-1 rounded hover:bg-red-500 transition"
                >
                  <FaBackward />
                </button>
                <button
                  onClick={togglePlay}
                  className="bg-black/70 px-2 py-1 rounded hover:bg-red-500 transition"
                >
                  {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                </button>
                <button
                  onClick={skipForward}
                  className="bg-black/70 px-2 py-1 rounded hover:bg-red-500 transition"
                >
                  <FaForward />
                </button>
              </div>
              {/* right side */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={handleMute}>
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                <input
                  type="range"
                  value={isMuted ? 0 : vol}
                  onChange={handleVolume}
                  min={0}
                  max={10}
                  step={0.1}
                  className="accent-red-500 w-16 sm:w-24"
                />
                <button onClick={handleFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==== */}
        <h1 className="mt-4 text-lg sm:text-xl font-bold text-white flex">
          {video?.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">{video?.views} views</p>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-start gap-4">
            <img
              src={channel?.avatar}
              alt=""
              className="w-12 h-12 rounded-full border-2 border-gray-600"
            />
            <div>
              <h1 className="font-bold">{channel?.name}</h1>
              <h3 className="text-[13px]">{channel?.subscribers?.length}</h3>
            </div>
            <button
              onClick={handleSubscribe}
              className={`px-[20px] py-2 rounded-4xl border border-gray-600 ml-5 ${
                isSubscribed
                  ? "bg-black text-white hover:bg-red-500 hover:text-black"
                  : "bg-white text-black hover:bg-red-500 hover:text-black"
              }`}
            >
              {loading
                ? "Loading..."
                : isSubscribed
                ? "Subscribed"
                : "Subscribe"}
            </button>
          </div>
          <div className="flex items-center gap-6 mt-3">
            <IconButton
              icon={FaThumbsUp}
              label={"Likes"}
              active={video?.likes?.includes(userData._id)}
              count={video?.likes.length}
            />

            <IconButton
              icon={FaThumbsDown}
              label={"Dislikes"}
              active={video?.Dislikes?.includes(userData._id)}
              count={video?.Dislikes?.length}
            />

            <IconButton
              icon={FaDownload}
              label={"Download"}
              onClick={() => {
                const link = document.createElement("a");
                link.href = video?.videoUrl;
                link.download = `${video?.title}.mp4`;
                link.click();
              }}
            />

            <IconButton
              icon={FaBookmark}
              label={"Save"}
              active={video?.saveBy?.includes(userData._id)}
            />
          </div>
        </div>

        {/* description */}
        <div className="mt-4 bg-[#1a1a1a] p-3 rounded-lg">
          <h2 className="font-semibold mb-2">Description</h2>
          <Description text={video?.description} />
        </div>

        {/* comment */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment"
              className="flex-1 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
              Post
            </button>
          </div>
        </div>
      </div>
      {/* suggested Video  */}
      <div className="w-full lg:w-[380px] px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
        <h2 className="flex items-center gap-2 font-bold text-lg mb-3">
          <SiYoutubestudio /> Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {suggestedShorts?.map((short) => (
            <div key={short._id}>
              <ShortCard
                shortUrl={short?.shortUrl}
                title={short?.title}
                channelName={short?.channel?.name}
                avatar={short?.channel?.avatar}
                id={short?._id}
              />
            </div>
          ))}
        </div>

        <div className="font-bold text-lg mt-4 mb-3">Up Next</div>
        <div className="space-y-3">
          {suggestedVideos?.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/play-video/${v._id}`)}
              className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition"
            >
              <img
                src={v?.thumbnail}
                alt=""
                className="w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold line-clamp-2 text-sm sm:text-base text-white">
                  {v?.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  {v?.channel?.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">{v?.views}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
