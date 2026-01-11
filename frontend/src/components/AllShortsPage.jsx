import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from "react-redux";
import ShortCard from "./ShortCard";

export default function AllShortsPage() {
  const { allShortsData } = useSelector((state) => state.content);
  const latestShorts = allShortsData?.slice(0, 10) || [];
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <SiYoutubeshorts className="text-red-600 text-xl" />
        <h2 className="text-lg font-semibold">Shorts</h2>
      </div>

      {/* Shorts List */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {latestShorts.map((short) => (
          <ShortCard
            key={short._id}
            shortUrl={short.shortUrl}
            title={short.title}
            avatar={short.channel?.avatar}
            channelName={short.channel?.name}
            views={short.views}
            id={short?._id}
          />
        ))}
      </div>
    </div>
  );
}
