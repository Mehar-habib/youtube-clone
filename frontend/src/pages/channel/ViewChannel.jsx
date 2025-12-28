import { useSelector } from "react-redux";
import banner from "../../assets/banner.jpg";
import logo from "../../assets/youtube.png";
import { useNavigate } from "react-router-dom";

export default function ViewChannel() {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-10 bg-[#0f0f0f] min-h-screen text-white">
      {/* Banner */}
      <div className="w-full h-60 md:h-80 rounded-xl overflow-hidden relative shadow-lg border border-gray-700">
        {channelData?.banner ? (
          <img
            src={channelData.banner}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={banner}
            alt="Default Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={channelData?.avatar}
            alt="Channel Avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-700 shadow-md"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            {channelData?.name}
          </h1>
          <p className="text-gray-400">{channelData?.owner?.email}</p>
          <p className="text-gray-300">
            More about this channel:{" "}
            <span className="text-red-500">{channelData?.category}</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition"
              onClick={() => navigate("/update-channel")}
            >
              Customize Channel
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-medium transition">
              Manage Videos
            </button>
          </div>
        </div>
      </div>

      {/* Create Content Section */}
      <div className="bg-[#181818] rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6 mt-10">
        <img
          src={logo}
          alt="YouTube Logo"
          className="w-20 h-20 md:w-24 md:h-24"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-semibold">
            Create content on any device
          </h2>
          <p className="text-gray-400">
            Upload and record at home or on the go. Everything you make public
            will appear here.
          </p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-medium transition">
          + Create
        </button>
      </div>
    </div>
  );
}
