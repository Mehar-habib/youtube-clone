import { MdOutlineSwitchAccount, MdLogout } from "react-icons/md";
import { SiYoutubestudio } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { TiUserAddOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "./CustomAlert";
import { setUserData } from "../redux/userSlice";

export default function Profile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div className="absolute right-5 top-16 w-72 bg-[#212121] text-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-700 hidden md:block">
      {/* User Info */}
      {userData && (
        <div className="flex flex-col gap-2 p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={userData?.photoUrl}
              alt="User"
              className="w-12 h-12 rounded-full object-cover border border-gray-700"
            />
            <div className="flex flex-col">
              <h4 className="font-semibold text-white">{userData.userName}</h4>
              <p className="text-sm text-gray-400">{userData.email}</p>
            </div>
          </div>
          <p className="text-sm text-red-500 hover:underline cursor-pointer">
            {userData?.channel ? "View Channel" : "Create Channel"}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col">
        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition text-white">
          <FcGoogle /> Sign in with Google
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition text-white"
          onClick={() => navigate("/signup")}
        >
          <TiUserAddOutline /> Create New Account
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition text-white"
          onClick={() => navigate("/signin")}
        >
          <MdOutlineSwitchAccount /> Sign in with Other Account
        </button>

        {userData?.channel && (
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition text-white">
            <SiYoutubestudio /> YT Studio
          </button>
        )}

        {userData && (
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2a] transition text-white"
            onClick={handleSignout}
          >
            <MdLogout /> Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
