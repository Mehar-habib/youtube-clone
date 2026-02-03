import axios from "axios";
import { FaHistory, FaList, FaThumbsUp } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GoVideo } from "react-icons/go";
import { MdLogout, MdOutlineSwitchAccount } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { TiUserAddOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { showCustomAlert } from "./CustomAlert";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

export default function MobileProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let user = await response.user;
      let userName = user.displayName.split(" ")[0];
      let email = user.email;
      let photoUrl = user.photoURL;

      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("photoUrl", photoUrl);

      const result = await axios.post(
        serverUrl + "/api/auth/google-auth",
        formData,
        {
          withCredentials: true,
        },
      );
      dispatch(setUserData(result.data));
      navigate("/");
      showCustomAlert("Sign In Successfully", "success");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response.data.message, "error");
    }
  };

  const handleSignout = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/auth/signout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      console.log(result.data);
      showCustomAlert("Sign Out Successfully", "success");
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response.data.message, "error");
    }
  };

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
            <span
              className="text-xs text-blue-400 mt-1 cursor-pointer"
              onClick={() => {
                userData?.channel
                  ? navigate("/view-channel")
                  : navigate("/create-channel");
              }}
            >
              {userData.channel ? "View channel" : "Create channel"}
            </span>
          </div>
        </div>
      )}

      {/* Auth Buttons */}
      <div className="space-y-2 mb-6">
        <AuthButton
          icon={<FcGoogle />}
          text="Sign in with Google"
          onClick={handleGoogleAuth}
        />
        <AuthButton
          icon={<TiUserAddOutline />}
          text="Create new account"
          onClick={() => navigate("/signup")}
        />
        <AuthButton
          icon={<MdOutlineSwitchAccount />}
          text="Sign in with another account"
          onClick={() => navigate("/signin")}
        />
        <AuthButton
          icon={<MdLogout />}
          text="Sign out"
          onClick={handleSignout}
          danger
        />
      </div>

      <hr className="border-gray-800 my-4" />

      {/* Menu Items */}
      <div className="space-y-1">
        <ProfileMenuItem icon={<FaHistory />} text="History" />
        <ProfileMenuItem icon={<FaList />} text="Playlists" />
        <ProfileMenuItem icon={<GoVideo />} text="Saved videos" />
        <ProfileMenuItem
          icon={<FaThumbsUp />}
          text="Liked videos"
          onClick={() => navigate("/liked-content")}
        />
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
