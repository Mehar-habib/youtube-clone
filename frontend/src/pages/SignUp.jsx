import { useState } from "react";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import logo from "../assets/youtube.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { showCustomAlert } from "../components/CustomAlert";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [backendImage, setBackendImage] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNext = () => {
    if (step === 1 && (!userName || !email)) {
      showCustomAlert("Fill all the fields", "error");
      return;
    }
    if (step === 2) {
      if (!password || !confirmPassword)
        return showCustomAlert("Fill all the fields", "error");
      if (password !== confirmPassword)
        return showCustomAlert("Password doesn't match", "error");
    }
    setStep(step + 1);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file); // ya image backend k lia h (cloudinary, multer)
    setFrontendImage(URL.createObjectURL(file)); //Browser ke andar temporary URL banta hai
  };

  const handleSignUp = async () => {
    if (!backendImage) {
      return showCustomAlert("Please select an image", "error");
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("photoUrl", backendImage);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signup",
        formData,
        { withCredentials: true }
      );
      console.log(result);
      dispatch(setUserData(result.data));
      showCustomAlert("Sign Up Successfully", "success");
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (error) {
      console.error(error);
      showCustomAlert(error.response.data.message, "error");
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#181818]">
      <div className="bg-[#202124] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-[#2a2a2a]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            className="text-gray-400 hover:text-white transition"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="text-white text-xl font-semibold">Create Account</h2>
        </div>

        {/* Step indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 w-full mx-1 rounded ${
                step >= s ? "bg-red-600" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" />
              Basic Info
            </h1>

            <input
              className="w-full mb-3 px-4 py-2 rounded bg-[#303134] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              className="w-full mb-6 px-4 py-2 rounded bg-[#303134] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
            >
              Next
            </button>

            <div className="mt-4 text-gray-300 text-center">
              Already have an account?{" "}
              <span
                className="text-red-600 cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </span>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" />
              Security
            </h1>

            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <FaUserCircle size={22} />
              <span>{email}</span>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full mb-3 px-4 py-2 rounded bg-[#303134] text-white focus:ring-2 focus:ring-red-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full mb-3 px-4 py-2 rounded bg-[#303134] text-white focus:ring-2 focus:ring-red-600"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="flex items-center gap-2 text-gray-400 mb-5 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>

            <button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
            >
              Next
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" />
              Choose Avatar
            </h1>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="w-28 h-28 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={90} className="text-gray-500" />
                )}
              </div>

              <label className="cursor-pointer text-sm text-red-500 hover:underline">
                Upload Profile Picture
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />
              </label>
            </div>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className={`w-full py-2 rounded font-medium transition flex items-center justify-center gap-2
    ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
  `}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
