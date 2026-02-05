import { useState } from "react";
import { SiYoutubestudio } from "react-icons/si";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Profile from "../../components/Profile";
import {
  FaChartBar,
  FaPlusCircle,
  FaTachometerAlt,
  FaVideo,
  FaBell,
  FaBars,
  FaTimes,
  FaMoneyBillWave,
} from "react-icons/fa";

const YTStudio = () => {
  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-gray-800 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 md:hidden"
            >
              {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="p-2 bg-red-600 rounded-lg">
                <SiYoutubestudio className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold">YouTube Studio</h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Creator Dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
              <FaPlusCircle />
              <span>Create</span>
            </button>

            <div className="relative">
              <img
                src={channelData?.avatar}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-gray-700 cursor-pointer hover:border-red-500 transition-colors"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <div className="absolute right-0 top-12 w-48 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl z-50">
                  <Profile />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden md:block w-64 flex-shrink-0 border-r border-gray-800 ${!sidebarOpen ? "hidden" : ""}`}
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src={channelData?.avatar}
                alt={channelData?.name}
                className="w-12 h-12 rounded-full border-2 border-gray-700"
              />
              <div>
                <h2 className="font-semibold text-white">
                  {channelData?.name}
                </h2>
                <p className="text-sm text-gray-400">Your channel</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <SidebarItem
              icon={<FaTachometerAlt className="text-lg" />}
              text="Dashboard"
              active={active === "Dashboard"}
              onClick={() => {
                setActive("Dashboard");
                navigate("/yt-studio/dashboard");
              }}
            />
            <SidebarItem
              icon={<FaVideo className="text-lg" />}
              text="Content"
              active={active === "Content"}
              onClick={() => {
                setActive("Content");
                navigate("/yt-studio/content");
              }}
            />
            <SidebarItem
              icon={<FaChartBar className="text-lg" />}
              text="Analytics"
              active={active === "Analytics"}
              onClick={() => {
                setActive("Analytics");
                navigate("/yt-studio/analytics");
              }}
            />
            <SidebarItem
              icon={<FaMoneyBillWave className="text-lg" />}
              text="Revenue"
              active={active === "Revenue"}
              onClick={() => {
                setActive("Revenue");
                navigate("/yt-studio/revenue");
              }}
            />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 z-40">
        <div className="flex justify-around py-3 px-2">
          <MobileNavItem
            icon={<FaTachometerAlt className="text-xl" />}
            text="Dashboard"
            active={active === "Dashboard"}
            onClick={() => {
              setActive("Dashboard");
              navigate("/yt-studio/dashboard");
            }}
          />
          <MobileNavItem
            icon={<FaVideo className="text-xl" />}
            text="Content"
            active={active === "Content"}
            onClick={() => {
              setActive("Content");
              navigate("/yt-studio/content");
            }}
          />
          <MobileNavItem
            icon={<FaPlusCircle className="text-2xl text-red-500" />}
            text="Create"
            onClick={() => navigate("/create")}
          />
          <MobileNavItem
            icon={<FaChartBar className="text-xl" />}
            text="Analytics"
            active={active === "Analytics"}
            onClick={() => {
              setActive("Analytics");
              navigate("/yt-studio/analytics");
            }}
          />
          <MobileNavItem
            icon={<FaMoneyBillWave className="text-xl" />}
            text="Revenue"
            active={active === "Revenue"}
            onClick={() => {
              setActive("Revenue");
              navigate("/yt-studio/revenue");
            }}
          />
        </div>
      </nav>
    </div>
  );
};

function SidebarItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-4 rounded-xl w-full transition-all ${
        active
          ? "bg-gradient-to-r from-red-600/20 to-red-500/10 border-l-4 border-red-500 text-red-400"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span className="font-medium">{text}</span>
    </button>
  );
}

function MobileNavItem({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
        active ? "text-red-400" : "text-gray-400 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span className="text-xs font-medium">{text}</span>
    </button>
  );
}

export default YTStudio;
