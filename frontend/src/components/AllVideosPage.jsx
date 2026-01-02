import { useSelector } from "react-redux";
import VideoCard from "./VideoCard";
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

export default function AllVideosPage() {
  const { allVideosData } = useSelector((state) => state.content);
  const [duration, setDuration] = useState({});

  useEffect(() => {
    allVideosData?.forEach((video) => {
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [allVideosData]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Videos Grid */}
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-x-6 
        gap-y-10
      "
      >
        {allVideosData?.map((video) => (
          <VideoCard
            key={video._id}
            thumbnail={video.thumbnail}
            title={video.title}
            channelLogo={video.channel?.avatar}
            channelName={video.channel?.name}
            duration={duration[video._id] || "0:00"}
            views={video.views}
          />
        ))}
      </div>
    </div>
  );
}
