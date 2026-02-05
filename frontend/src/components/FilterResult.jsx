import { useEffect, useState } from "react";
import ShortCard from "./ShortCard";
import VideoCard from "./VideoCard";

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
const FilterResult = ({ filterResults }) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    filterResults.videos.forEach((video) => {
      getVideoDuration(video.videoUrl, (time) => {
        setDuration((prev) => ({ ...prev, [video._id]: time }));
      });
    });
  }, [filterResults.videos]);
  const isEmpty =
    (!filterResults?.videos || filterResults.videos.length === 0) &&
    (!filterResults?.shorts || filterResults.shorts.length === 0) &&
    (!filterResults?.channels || filterResults.channels.length === 0) &&
    (!filterResults?.playlists || filterResults.playlists.length === 0);
  return (
    <div className="px-6 py-4 bg-[#00000051] border-l border-gray-800 mb-5">
      <h2 className="text-2xl font-bold mb-4">Search Results :</h2>
      {isEmpty ? (
        <p className="text-gray-400 text-lg">No Results found</p>
      ) : (
        <>
          {/* video section */}
          {filterResults.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Videos</h3>
              <div className="flex flex-wrap gap-6 mb-12">
                {filterResults.videos.map((video) => (
                  <VideoCard
                    key={video._id}
                    thumbnail={video.thumbnail}
                    duration={duration[video._id] || "00:00"}
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
          {filterResults.shorts?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {filterResults.shorts.map((short) => (
                  <ShortCard
                    shortUrl={short.shortUrl}
                    title={short.title}
                    avatar={short.channel?.avatar}
                    channelName={short.channel?.name}
                    views={short.views}
                    id={short._id}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FilterResult;
