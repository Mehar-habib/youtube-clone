import { useEffect, useState } from "react";
import { SiYoutubeshorts } from "react-icons/si";
import { GoVideo } from "react-icons/go";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import { useSelector } from "react-redux";

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

const History = () => {
  const { historyVideo, historyShort } = useSelector((state) => state.user);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    historyVideo.forEach((v) => {
      const video = v?.contentId;
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [historyVideo]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 mt-12 lg:mt-5 space-y-10">
      {/* ================= SHORTS ================= */}
      {historyShort.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600">
              <SiYoutubeshorts className="text-lg" />
              <span className="font-semibold text-sm"> Shorts</span>
            </div>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
            {historyShort.map((s) => {
              const short = s.contentId;
              return (
                <div key={s._id} className="shrink-0">
                  <ShortCard
                    shortUrl={short?.shortUrl}
                    title={short?.title}
                    channelName={short?.channel?.name}
                    views={short?.views}
                    id={short?._id}
                    avatar={short?.channel?.avatar}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= VIDEOS ================= */}
      {historyVideo.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
              <GoVideo className="text-lg" />
              <span className="font-semibold text-sm"> Videos</span>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide">
            {historyVideo.map((video) => {
              const v = video.contentId;
              return (
                <div key={video._id} className="shrink-0">
                  <VideoCard
                    thumbnail={v?.thumbnail}
                    duration={duration[v._id] || "0:00"}
                    channelLogo={v?.channel?.avatar}
                    title={v?.title}
                    channelName={v?.channel?.name}
                    views={v?.views}
                    id={v?._id}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= EMPTY STATE ================= */}
      {historyVideo.length === 0 && historyShort.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-400 h-[60vh] text-center">
          <GoVideo className="text-5xl mb-4 opacity-40" />
          <p className="text-lg font-medium">No history content yet</p>
          <p className="text-sm mt-1">Like videos or shorts to see them here</p>
        </div>
      )}
    </div>
  );
};

export default History;
