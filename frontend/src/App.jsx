import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CustomAlert from "./components/CustomAlert";
import Shorts from "./pages/Shorts/Shorts";
import getCurrentUser from "./customHooks/getCurrentUser";
import MobileProfile from "./components/MobileProfile";

export const serverUrl = "http://localhost:8000";

export default function App() {
  getCurrentUser();
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobile-profile" element={<MobileProfile />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}
