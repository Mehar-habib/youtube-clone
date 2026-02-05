import { useRef, useState } from "react";
import logo from "../assets/youtube.png";
import "../App.css";

import {
  FaBars,
  FaUserCircle,
  FaHome,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes,
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
import { showCustomAlert } from "../components/CustomAlert";
import axios from "axios";
import { serverUrl } from "../App";
import SearchResult from "../components/SearchResult";
import FilterResult from "../components/FilterResult";
import RecommendedContent from "./RecommendedContent";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, subscribedChannels } = useSelector((state) => state.user);
  const [popup, setPopup] = useState(false);
  const [searchPopup, setSearchPopup] = useState(false);
  const [listening, setListening] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("");

  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }
  const recognitionRef = useRef();
  if (
    !recognitionRef.current &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  ) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
  }
  const handleSearch = async () => {
    if (!recognitionRef.current) {
      showCustomAlert(
        "Speech recognition is not supported in your browser",
        "error",
      );
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    setListening(true);
    recognitionRef.current.start();
    recognitionRef.current.onresult = async (e) => {
      const transcript = e.results[0][0]?.transcript.trim();
      setInput(transcript);
      setListening(false);
      await handleSearchData(transcript);
    };
    recognitionRef.current.onerror = (err) => {
      console.error("Recognition Error:", err);
      setListening(false);
      if (err.error === "no-speech") {
        showCustomAlert("No speech detected", "error");
      } else {
        showCustomAlert("Speech recognition error", "error");
      }
    };
    recognitionRef.current.onend = () => {
      setListening(false);
    };
  };
  const handleSearchData = async (query) => {
    if (!query || !query.trim()) return;
    if (loading) return;
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/content/search",
        { input: query.trim() },
        { withCredentials: true },
      );
      console.log(result.data);
      setSearchData(result.data);
      setInput("");
      setSearchPopup(false);
      setLoading(false);

      const {
        videos = [],
        shorts = [],
        playlists = [],
        channels = [],
      } = result.data;
      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        playlists.length > 0 ||
        channels.length > 0
      ) {
        speak("These are the top search results I found for you");
      } else {
        speak("No Result Found");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

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
  const handleCategoryFilter = async (category) => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/content/filter",
        { input: category },
        { withCredentials: true },
      );
      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = [];
      let channelShorts = [];
      channels.forEach((ch) => {
        if (ch.videos?.length) channelVideos.push(...ch.videos);
        if (ch.shorts?.length) channelShorts.push(...ch.shorts);
      });
      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });
      setLoading(false);
      navigate("/");
      if (
        videos.length > 0 ||
        shorts.length > 0 ||
        channelVideos.length > 0 ||
        channelShorts.length > 0
      ) {
        speak(`Here are some ${category} videos and shorts for you`);
      } else {
        speak("No results found");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen relative">
      {searchPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-[400px] sm:min-h-[480px] p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              onClick={() => setSearchPopup(false)}
            >
              <FaTimes size={22} />
            </button>

            <div className="flex flex-col items-center gap-3">
              {listening ? (
                <h1 className="text-xl sm:text-2xl font-semibold text-red-500 animate-pulse">
                  Listening...
                </h1>
              ) : (
                <h1 className="text-lg sm:text-xl font-medium text-gray-300">
                  Speak or type your query
                </h1>
              )}
              {/* show recognition text */}
              {input && (
                <span className="text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60">
                  {input}
                </span>
              )}

              <div className="flex w-full gap-2 md:hidden mt-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-red-400 focus:ring-2 focus:ring-red-500 transition"
                  placeholder="Type your search"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50"
                  onClick={() => handleSearchData(input)}
                >
                  {loading ? "Loading..." : <FaSearch />}
                </button>
              </div>
            </div>
            <button
              className="p-6 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 bg-red-500 hover:bg-red-600 shadow-red-500/40"
              onClick={handleSearch}
            >
              <FaMicrophone size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars size={20} />
            </button>
            <div
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="px-3 bg-[#272727]"
                onClick={() => handleSearchData(input)}
              >
                {loading ? "Loading..." : <FaSearch />}
              </button>
            </div>
            <button
              className="p-3 bg-[#272727] rounded-full"
              onClick={() => setSearchPopup(!searchPopup)}
            >
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
            <FaSearch
              className="text-lg md:hidden flex"
              onClick={() => setSearchPopup(!searchPopup)}
            />
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
            onClick={() => {
              setSelectedItem("Subscriptions");
              navigate("/subscription");
            }}
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
            onClick={() => {
              setSelectedItem("History");
              navigate("/history");
            }}
          />
          <SidebarItem
            icon={<MdOutlinePlaylistPlay />}
            text="Playlist"
            open={sidebarOpen}
            selected={selectedItem === "Playlist"}
            onClick={() => {
              setSelectedItem("Playlist");
              navigate("/saved-playlist");
            }}
          />
          <SidebarItem
            icon={<GoVideo />}
            text="Save Videos"
            open={sidebarOpen}
            selected={selectedItem === "Save Videos"}
            onClick={() => {
              setSelectedItem("Save Videos");
              navigate("/saved-content");
            }}
          />
          <SidebarItem
            icon={<FaThumbsUp />}
            text="Liked Videos"
            open={sidebarOpen}
            selected={selectedItem === "Liked Videos"}
            onClick={() => {
              setSelectedItem("Liked Videos");
              navigate("/liked-content");
            }}
          />
        </nav>

        {/* subscription */}
        <hr className="border-gray-800 my-3" />
        {sidebarOpen && (
          <p className="text-gray-400 text-sm px-2">Subscriptions</p>
        )}
        <div className="space-y-1 mt-1">
          {subscribedChannels?.map((ch) => (
            <button
              key={ch?._id}
              onClick={() => {
                setSelectedItem(ch?._id);
                navigate(`/channel-page/${ch?._id}`);
              }}
              className={`flex items-center ${sidebarOpen ? "gap-3 justify-start" : "justify-center"} w-full text-left cursor-pointer p-2 rounded-lg transition ${selectedItem === ch?._id ? "bg-[#272727]" : "hover:bg-gray-800"}`}
            >
              <img
                src={ch?.avatar}
                alt=""
                className="w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200"
              />
              {sidebarOpen && (
                <span className="text-sm truncate text-white">{ch?.name}</span>
              )}
            </button>
          ))}
        </div>
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
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {loading && (
                <div className="w-full items-center flex justify-center">
                  {loading ? "Loading..." : "No videos found"}
                </div>
              )}
              {searchData && <SearchResult searchResults={searchData} />}
              {filterData && <FilterResult filterResults={filterData} />}

              {userData ? (
                <RecommendedContent />
              ) : (
                <>
                  <AllVideosPage />
                  <AllShortsPage />
                </>
              )}
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
          onClick={() => {
            setActive("Shorts");
            navigate("/shorts");
          }}
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
          onClick={() => {
            setActive("Subscriptions");
            navigate("/subscription");
          }}
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
