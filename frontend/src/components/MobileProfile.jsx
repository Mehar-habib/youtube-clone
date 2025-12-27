import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GoVideo } from "react-icons/go";
import { MdLogout, MdOutlineSwitchAccount } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { TiUserAddOutline } from "react-icons/ti";
import { useSelector } from "react-redux";

export default function MobileProfile() {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="md:hidden bg-[#0f0f0f] text-white min-h-screen w-full ">
      {/* Profile Section */}
      {userData && (
        <div className="flex items-center gap-3 mb-6">
          {userData.photoUrl && (
            <img
              src={userData.photoUrl}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userData.userName}</span>
            <span className="text-xs text-gray-400">{userData.email}</span>
            <span className="text-xs text-blue-400 mt-1 cursor-pointer">
              {userData.channel ? "View channel" : "Create channel"}
            </span>
          </div>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="space-y-2 mb-6">
        <AuthButton icon={<FcGoogle />} text="Sign in with Google" />
        <AuthButton icon={<TiUserAddOutline />} text="Create new account" />
        <AuthButton
          icon={<MdOutlineSwitchAccount />}
          text="Sign in with another account"
        />
        <AuthButton icon={<MdLogout />} text="Sign out" danger />
      </div>

      <hr className="border-gray-800 my-4" />

      {/* Menu Items */}
      <div className="space-y-1">
        <ProfileMenuItem icon={<FaHistory />} text="History" />
        <ProfileMenuItem icon={<FaList />} text="Playlists" />
        <ProfileMenuItem icon={<GoVideo />} text="Saved videos" />
        <ProfileMenuItem icon={<FaThumbsUp />} text="Liked videos" />
        <ProfileMenuItem icon={<SiYoutubestudio />} text="YouTube Studio" />
      </div>
    </div>
  );
}

/* ------------------ Components ------------------ */

const ProfileMenuItem = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full px-4 py-3 rounded-lg text-gray-300
                 hover:bg-[#1f1f1f] transition"
    >
      <span className="text-xl text-gray-400">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};

const AuthButton = ({ icon, text, danger }) => {
  return (
    <button
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "hover:bg-[#1f1f1f] text-gray-300"
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
};
