import { FaComment, FaThumbsUp, FaEye, FaVideo, FaUsers } from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { channelData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const totalVideoViews = (channelData?.videos || []).reduce(
    (acc, vid) => acc + (vid.views || 0),
    0,
  );
  const totalShortViews = (channelData?.shorts || []).reduce(
    (acc, short) => acc + (short.views || 0),
    0,
  );
  const totalViews = totalShortViews + totalVideoViews;
  const subscriberCount = channelData?.subscribers?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={channelData?.avatar}
              alt={channelData?.name}
              className="w-16 h-16 rounded-full border-2 border-gray-700"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                {channelData?.name}
              </h2>
              <p className="text-gray-400">
                {subscriberCount.toLocaleString()} Subscribers
              </p>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Channel Analytics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <AnalyticsCard
              label="Total Views"
              value={totalViews.toLocaleString() || "0"}
              icon={<FaEye className="text-blue-400" />}
              onClick={() => navigate("/yt-studio/analytics")}
              color="blue"
            />
            <AnalyticsCard
              label="Subscribers"
              value={`+${subscriberCount}`}
              icon={<FaUsers className="text-green-400" />}
              color="green"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Latest Videos */}
          {channelData?.videos?.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FaVideo className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Latest Videos
                </h3>
              </div>
              <div className="space-y-4">
                {(channelData?.videos || [])
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((v) => (
                    <ContentCardForVideo
                      key={v._id}
                      content={v}
                      onClick={() => navigate(`/play-video/${v._id}`)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Latest Shorts */}
          {channelData?.shorts?.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <SiYoutubeshorts className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Latest Shorts
                </h3>
              </div>
              <div className="space-y-4">
                {(channelData?.shorts || [])
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((s) => (
                    <ContentCardForShort
                      key={s._id}
                      content={s}
                      onClick={() => navigate(`/play-short/${s._id}`)}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {channelData?.videos?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {channelData?.shorts?.length || 0}
              </div>
              <div className="text-sm text-gray-400">Shorts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ContentCardForVideo({ content, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-lg bg-[#222] hover:bg-[#2a2a2a] cursor-pointer transition-all hover:scale-[1.02]"
    >
      <div className="relative flex-shrink-0">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-24 h-14 rounded-lg object-cover"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1.5 py-0.5 rounded">
          5:30
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-white line-clamp-1 mb-1">
          {content.title}
        </h4>
        <p className="text-xs text-gray-400 mb-2">
          Published {new Date(content.createdAt).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <FaEye className="text-xs" />
            <span>{content.views?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaThumbsUp className="text-xs" />
            <span>{content.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaComment className="text-xs" />
            <span>{content.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentCardForShort({ content, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-lg bg-[#222] hover:bg-[#2a2a2a] cursor-pointer transition-all hover:scale-[1.02]"
    >
      <div className="relative flex-shrink-0">
        <video
          src={content.shortUrl}
          className="w-16 h-24 rounded-lg object-cover"
          muted
          playsInline
          preload="metadata"
          onContextMenu={(e) => e.preventDefault()}
        />
        <div className="absolute top-1 right-1 bg-black/80 text-[8px] px-1.5 py-0.5 rounded">
          SHORT
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-white line-clamp-2 mb-1">
          {content.title}
        </h4>
        <p className="text-xs text-gray-400 mb-2">
          Published {new Date(content.createdAt).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <FaEye className="text-xs" />
            <span>{content.views?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaThumbsUp className="text-xs" />
            <span>{content.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaComment className="text-xs" />
            <span>{content.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ label, value, icon, onClick, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20",
    green: "from-green-500/20 to-green-600/20",
    red: "from-red-500/20 to-red-600/20",
    purple: "from-purple-500/20 to-purple-600/20",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} border border-gray-800 rounded-xl p-5 hover:scale-[1.02] transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-gray-300 text-sm font-medium">{label}</div>
        <div className="p-2 rounded-lg bg-white/10">{icon}</div>
      </div>
      <h4 className="text-2xl font-bold text-white">{value}</h4>
    </div>
  );
}

export default Dashboard;
