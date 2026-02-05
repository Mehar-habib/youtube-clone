import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { useEffect, useState } from "react";

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
const RecommendedContent = () => {
  const { recommendedContent } = useSelector((state) => state.user);
  const [duration, setDuration] = useState({});

  const allVideos = [
    ...(recommendedContent?.recommendedVideos || []),
    ...(recommendedContent?.remainingVideos || []),
  ];
  const allShorts = [
    ...(recommendedContent?.recommendedShorts || []),
    ...(recommendedContent?.remainingShorts || []),
  ];
  useEffect(() => {
    allVideos.forEach((video) => {
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [recommendedContent]);
  return (
    <div className="px-6 py-4 mb-5">
      {allVideos.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-6 mb-12">
            {allVideos.map((video) => (
              <VideoCard
                key={video._id}
                thumbnail={video.thumbnail}
                duration={duration[video._id] || "0:00"}
                channelLogo={video.channel?.avatar}
                title={video.title}
                channelName={video.channel?.name}
                views={video.views}
                id={video._id}
              />
            ))}
          </div>
        </div>
      )}
      {/* short section */}
      {allShorts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-1">
            <SiYoutubeshorts className="text-red-600" size={26} /> Shorts
          </h3>
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
            {allShorts.map((short) => (
              <div key={short._id} className="flex-shrink-0">
                <ShortCard
                  shortUrl={short.shortUrl}
                  title={short.title}
                  channelName={short.channel?.name}
                  avatar={short.channel?.avatar}
                  views={short.views}
                  id={short._id}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendedContent;
