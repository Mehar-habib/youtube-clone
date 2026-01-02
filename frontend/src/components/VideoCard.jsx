export default function VideoCard({
  thumbnail,
  duration,
  title,
  channelLogo,
  channelName,
  views,
}) {
  return (
    <div className="cursor-pointer group">
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden bg-[#1f1f1f]">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-[190px] object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-2 py-0.5 rounded">
          {duration}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex gap-3 mt-3">
        {/* Channel Avatar */}
        <img
          src={channelLogo}
          alt={channelName}
          className="w-9 h-9 rounded-full object-cover"
        />

        {/* Text */}
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-400 text-xs mt-1 hover:text-white transition">
            {channelName}
          </p>

          <p className="text-gray-400 text-xs mt-0.5">{views || 0} views</p>
        </div>
      </div>
    </div>
  );
}
