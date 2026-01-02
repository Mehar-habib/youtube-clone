import { useState } from "react";
import logo from "../assets/youtube.png";
import "../App.css";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import {
  MdOutlineSubscriptions,
  MdHistory,
  MdOutlinePlaylistPlay,
} from "react-icons/md";
import { GoVideo } from "react-icons/go";
import { IoIosAddCircle } from "react-icons/io";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile from "../components/Profile";
import AllVideosPage from "../components/AllVideosPage";
import AllShortsPage from "../components/AllShortsPage";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector((state) => state.user);
  const [popup, setPopup] = useState(false);

  const categories = [
    "Music",
    "Movies",
    "Gaming",
    "News",
    "Sports",
    "Education",
    "Comedy",
    "Vlogs",
    "Science & Tech",
    "Entertainment",
    "Art",
    "Pets",
    "Cooking",
    "Fashion",
    "Travel",
  ];

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {/* Navbar */}
      <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="font-semibold text-lg">YouTube</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
            <div className="flex flex-1 border border-gray-700 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-3 py-1 bg-[#1f1f1f] focus:outline-none text-white"
              />
              <button className="px-3 bg-[#272727]">
                <FaSearch />
              </button>
            </div>
            <button className="p-3 bg-[#272727] rounded-full">
              <FaMicrophone />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {userData?.channel && (
              <button
                className="hidden md:flex items-center gap-1 bg-[#272727] px-3 py-1 rounded-full hover:bg-[#3a3a3a] transition"
                onClick={() => navigate("/create")}
              >
                <span className="text-lg">+</span>
                <span>Create</span>
              </button>
            )}
            {popup ? (
              // CLOSE ICON (jab popup open ho)
              <button
                onClick={() => setPopup(false)}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition"
              >
                ✕
              </button>
            ) : !userData?.photoUrl ? (
              // DEFAULT USER ICON
              <FaUserCircle
                className="text-3xl hidden md:flex text-gray-400 cursor-pointer"
                onClick={() => setPopup(true)}
              />
            ) : (
              // PROFILE PHOTO
              <img
                src={userData?.photoUrl}
                className="w-9 h-9 rounded-full object-cover border border-gray-700 hidden md:flex cursor-pointer"
                onClick={() => setPopup(true)}
              />
            )}
            <FaSearch className="text-lg md:hidden flex" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`bg-[#0f0f0f] border-r border-gray-800 fixed top-[60px] z-40 bottom-0 transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-20"
        } hidden md:flex flex-col overflow-y-auto`}
      >
        <nav className="flex flex-col p-2">
          <SidebarItem
            icon={<FaHome />}
            text="Home"
            open={sidebarOpen}
            selected={selectedItem === "Home"}
            onClick={() => {
              setSelectedItem("Home");
              navigate("/");
            }}
          />
          <SidebarItem
            icon={<SiYoutubeshorts />}
            text="Shorts"
            open={sidebarOpen}
            selected={selectedItem === "Shorts"}
            onClick={() => {
              setSelectedItem("Shorts");
              navigate("/shorts");
            }}
          />
          <SidebarItem
            icon={<MdOutlineSubscriptions />}
            text="Subscriptions"
            open={sidebarOpen}
            selected={selectedItem === "Subscriptions"}
            onClick={() => setSelectedItem("Subscriptions")}
          />
        </nav>

        <hr className="border-gray-700 my-2" />

        <nav className="flex flex-col p-2">
          {sidebarOpen && <p className="text-gray-400 mb-2 px-2">You</p>}
          <SidebarItem
            icon={<MdHistory />}
            text="History"
            open={sidebarOpen}
            selected={selectedItem === "History"}
            onClick={() => setSelectedItem("History")}
          />
          <SidebarItem
            icon={<MdOutlinePlaylistPlay />}
            text="Playlist"
            open={sidebarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => setSelectedItem("Playlist")}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Save Videos"
            open={sidebarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => setSelectedItem("Save Videos")}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => setSelectedItem("Liked Videos")}
          />
        </nav>
      </aside>

      {/* Main content */}

      <main
        className={`overflow-y-auto p-4 flex flex-col pt-20 pb-16 transition-all duration-300 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
        {/* Categories */}
        {location.pathname === "/" && (
          <>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-4">
              {categories.map((category, idx) => (
                <button
                  key={idx}
                  className="px-3 py-1 rounded-full bg-[#272727] hover:bg-[#3a3a3a] whitespace-nowrap transition"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <AllVideosPage />
              <AllShortsPage />
            </div>
          </>
        )}

        {/* Outlet for nested routes */}
        {popup && <Profile />}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 z-50">
        <MobileSizeNav
          icon={<FaHome />}
          text="Home"
          active={active === "Home"}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        />
        <MobileSizeNav
          icon={<SiYoutubeshorts />}
          text="Shorts"
          active={active === "Shorts"}
          onClick={() => setActive("Shorts")}
        />
        <MobileSizeNav
          icon={<IoIosAddCircle size={40} />}
          active={active === "+"}
          onClick={() => {
            setActive("+");
            navigate("/create");
          }}
        />
        <MobileSizeNav
          icon={<MdOutlineSubscriptions />}
          text="Subscriptions"
          active={active === "Subscriptions"}
          onClick={() => setActive("Subscriptions")}
        />
        <MobileSizeNav
          icon={
            !userData?.photoUrl ? (
              <FaUserCircle />
            ) : (
              <img
                src={userData?.photoUrl}
                className="w-8 h-8 rounded-full object-cover border border-gray-700"
              />
            )
          }
          text="You"
          active={active === "You"}
          onClick={() => {
            setActive("You");
            navigate("/mobile-profile");
          }}
        />
      </nav>
    </div>
  );
}

// Sidebar Item
function SidebarItem({ icon, text, open, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-4 p-2 rounded w-full transition-colors ${
        open ? "justify-start" : "justify-center"
      } ${selected ? "bg-[#272727]" : "hover:bg-[#272727]"}`}
      onClick={onClick}
    >
      <span className="text-lg">{icon}</span>
      {open && <span>{text}</span>}
    </button>
  );
}

// Mobile Nav Item
function MobileSizeNav({ icon, text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 px-2 sm:px-3 ${
        active ? "text-white" : "text-gray-400"
      } hover:scale-105 transition`}
    >
      <span>{icon}</span>
      {text && <span className="text-xs">{text}</span>}
    </button>
  );
}
