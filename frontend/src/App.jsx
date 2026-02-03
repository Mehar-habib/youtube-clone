import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CustomAlert, { showCustomAlert } from "./components/CustomAlert";
import Shorts from "./pages/Shorts/Shorts";
import getCurrentUser from "./customHooks/getCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgotPassword from "./pages/ForgotPassword";
import CreateChannel from "./pages/channel/CreateChannel";
import ViewChannel from "./pages/channel/ViewChannel";
import getChannelData from "./customHooks/getChannelData";
import UpdateChannel from "./pages/channel/UpdateChannel";
import { useSelector } from "react-redux";
import CreatePage from "./pages/CreatePage";
import CreateVideo from "./pages/Videos/CreateVideo";
import CreateShorts from "./pages/Shorts/CreateShorts";
import CreatePlaylist from "./pages/Playlist/CreatePlaylist";
import PlayShort from "./pages/Shorts/PlayShort";
import getAllContentData from "./customHooks/getAllContentData";
import CreatePost from "./pages/Post/CreatePost";
import PlayVideo from "./pages/Videos/PlayVideo";
import ChannelPage from "./pages/channel/ChannelPage";
import LikedContent from "./pages/likedContnet/LikedContent";

export const serverUrl = "http://localhost:8000";

const ProtectRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please Sign Up first to use this feature", "error");
    return <Navigate to="/" />;
  }
  return children;
};
export default function App() {
  getCurrentUser();
  getChannelData();
  getAllContentData();
  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectRoute userData={userData}>
                <Shorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/play-short/:shortId"
            element={
              <ProtectRoute userData={userData}>
                <PlayShort />
              </ProtectRoute>
            }
          />
          <Route
            path="/mobile-profile"
            element={
              <ProtectRoute userData={userData}>
                <MobileProfile />
              </ProtectRoute>
            }
          />
          <Route
            path="/view-channel"
            element={
              <ProtectRoute userData={userData}>
                <ViewChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/update-channel"
            element={
              <ProtectRoute>
                <UpdateChannel />
              </ProtectRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectRoute userData={userData}>
                <CreatePage />
              </ProtectRoute>
            }
          />

          <Route
            path="/create-video"
            element={
              <ProtectRoute userData={userData}>
                <CreateVideo />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-short"
            element={
              <ProtectRoute userData={userData}>
                <CreateShorts />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-playlist"
            element={
              <ProtectRoute userData={userData}>
                <CreatePlaylist />
              </ProtectRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectRoute userData={userData}>
                <CreatePost />
              </ProtectRoute>
            }
          />
          <Route
            path="/channel-page/:channelId"
            element={
              <ProtectRoute userData={userData}>
                <ChannelPage />
              </ProtectRoute>
            }
          />
          <Route
            path="/liked-content"
            element={
              <ProtectRoute userData={userData}>
                <LikedContent />
              </ProtectRoute>
            }
          />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/create-channel"
          element={
            <ProtectRoute userData={userData}>
              <CreateChannel />
            </ProtectRoute>
          }
        />

        <Route
          path="/play-video/:videoId"
          element={
            <ProtectRoute userData={userData}>
              <PlayVideo />
            </ProtectRoute>
          }
        />
      </Routes>
    </>
  );
}
