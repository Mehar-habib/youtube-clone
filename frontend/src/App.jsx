import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CustomAlert from "./components/CustomAlert";
import Shorts from "./pages/Shorts/Shorts";
import getCurrentUser from "./customHooks/getCurrentUser";
import MobileProfile from "./components/MobileProfile";
import ForgotPassword from "./pages/ForgotPassword";
import CreateChannel from "./pages/channel/CreateChannel";
import ViewChannel from "./pages/channel/ViewChannel";
import getChannelData from "./customHooks/getChannelData";
import UpdateChannel from "./pages/channel/UpdateChannel";

export const serverUrl = "http://localhost:8000";

export default function App() {
  getCurrentUser();
  getChannelData();
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobile-profile" element={<MobileProfile />} />
          <Route path="/view-channel" element={<ViewChannel />} />
          <Route path="/update-channel" element={<UpdateChannel />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-channel" element={<CreateChannel />} />
      </Routes>
    </>
  );
}
