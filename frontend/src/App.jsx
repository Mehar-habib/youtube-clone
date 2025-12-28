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
import CreatePage from "./pages/Shorts/CreatePage";

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
      </Routes>
    </>
  );
}
