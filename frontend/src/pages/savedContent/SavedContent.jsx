import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../App";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";

/* ---------- UTILITY ---------- */
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

const SavedContent = () => {
  const [saveVideo, setSaveVideo] = useState([]);
  const [saveShort, setSaveShort] = useState([]);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    saveVideo.forEach((video) => {
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [saveVideo]);

  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        const videos = await axios.get(serverUrl + "/api/content/saved-video", {
          withCredentials: true,
        });
        setSaveVideo(videos.data);

        const shorts = await axios.get(serverUrl + "/api/content/saved-short", {
          withCredentials: true,
        });
        setSaveShort(shorts.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSavedContent();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 mt-12 lg:mt-5 space-y-10">
      {/* ================= SHORTS ================= */}
      {saveShort.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600">
              <SiYoutubeshorts className="text-lg" />
              <span className="font-semibold text-sm">Saved Shorts</span>
            </div>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
            {saveShort.map((short) => (
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
      {saveVideo.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <GoVideo className="text-lg" />
              <span className="font-semibold text-sm">Saved Videos</span>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
            {saveVideo.map((v) => (
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

      {/* ================= EMPTY STATE ================= */}
      {saveVideo.length === 0 && saveShort.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-400 h-[60vh] text-center">
          <GoVideo className="text-5xl mb-4 opacity-40" />
          <p className="text-lg font-medium">No Saved content yet</p>
          <p className="text-sm mt-1">Save videos or shorts to see them here</p>
        </div>
      )}
    </div>
  );
};

export default SavedContent;
