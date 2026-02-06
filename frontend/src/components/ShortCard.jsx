import { useNavigate } from "react-router-dom";

export default function ShortCard({
  shortUrl,
  title,
  channelName,
  avatar,
  views,
  id,
}) {
  const navigate = useNavigate();
  return (
    <div
      className="w-[160px] sm:w-[180px] flex-shrink-0 cursor-pointer"
      onClick={() => navigate(`/play-short/${id}`)}
    >
      {/* Video */}
      <div className="relative rounded-xl overflow-hidden">
        <video
          src={shortUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-[280px] object-cover"
        />
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>

        <div className="flex items-center gap-2 mt-1">
          <img
            src={avatar}
            alt={channelName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <p className="text-xs text-gray-400 truncate">{channelName}</p>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          {Number(views) >= 1_000_000
            ? Math.floor(Number(views) / 1_000_000) + "M"
            : Number(views) >= 1_000
              ? Math.floor(Number(views) / 1_000) + "K"
              : Number(views) || 0}{" "}
          views
        </p>
      </div>
    </div>
  );
}
