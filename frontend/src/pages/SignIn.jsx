// export default function SignIn() {
//   const handleNext = () => {
//       if (step === 1 && ( !email)) {
//         showCustomAlert("");
//         return;
//       }
//       if (step === 2) {
//         if (!password)
//           return showCustomAlert("Fill all the fields");
//       }
//       setStep(step + 1);
//     };
//   return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black to-[#181818]">
//         <div className="bg-[#202124] rounded-2xl p-8 w-full max-w-md shadow-2xl border border-[#2a2a2a]">
//           {/* Header */}
//           <div className="flex items-center gap-3 mb-6">
//             <button
//               className="text-gray-400 hover:text-white transition"
//               onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
//             >
//               <FaArrowLeft size={18} />
//             </button>
//             <h2 className="text-white text-xl font-semibold">Youtube</h2>
//           </div>

//           {/* Step indicator */}
//           <div className="flex justify-between mb-6">
//             {[1, 2, 3].map((s) => (
//               <div
//                 key={s}
//                 className={`h-1 w-full mx-1 rounded ${
//                   step >= s ? "bg-red-600" : "bg-gray-600"
//                 }`}
//               />
//             ))}
//           </div>

//           {/* STEP 1 */}
//           {step === 1 && (
//             <>
//               <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
//                 <img src={logo} className="w-7 h-7" />
//                 Sign In
//               </h1>
//               <p>with your Account to continue to Youtube</p>
//               <input
//                 className="w-full mb-6 px-4 py-2 rounded bg-[#303134] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
//                 placeholder="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />

//               <button

//                 className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
//               >
//                 Create Account
//               </button>
//               <button>Next</button>
//             </>
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <>
//               <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
//                 <img src={logo} className="w-7 h-7" />
//                 Welcome
//               </h1>

//               <div className="flex items-center gap-2 text-gray-300 mb-4">
//                 <FaUserCircle size={22} />
//                 <span>{email}</span>
//               </div>

//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 className="w-full mb-3 px-4 py-2 rounded bg-[#303134] text-white focus:ring-2 focus:ring-red-600"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />

//               <label className="flex items-center gap-2 text-gray-400 mb-5 text-sm">
//                 <input
//                   type="checkbox"
//                   checked={showPassword}
//                   onChange={() => setShowPassword(!showPassword)}
//                 />
//                 Show Password
//               </label>

//               <button
//                 className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
//               >
//                 Forgot Passwrd
//               </button>
//               <button>Sign In</button>
//             </>
//           )}

//         </div>
//       </div>
// }

import { useState } from "react";
import { FaArrowLeft, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/youtube.png";
import { showCustomAlert } from "../components/CustomAlert";
import axios from "axios";
import { serverUrl } from "../App";

export default function SignIn() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === 1 && !email) {
      showCustomAlert("Please enter your email", "error");
      return;
    }
    if (step === 2 && !password) {
      showCustomAlert("Please enter your password", "error");
      return;
    }
    setStep(step + 1);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      navigate("/");
      setLoading(false);
      showCustomAlert("Sign In Successfully", "success");
    } catch (error) {
      console.error(error);
      setLoading(false);
      showCustomAlert(error.response.data.message, "error");
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
          <h2 className="text-white text-xl font-semibold">YouTube</h2>
        </div>

        {/* Step Indicator */}
        <div className="flex mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 mx-1 rounded ${
                step >= s ? "bg-red-600" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* STEP 1 – EMAIL */}
        {step === 1 && (
          <>
            <h1 className="text-2xl text-white mb-2 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" />
              Sign in
            </h1>
            <p className="text-gray-400 mb-6">Continue to YouTube</p>

            <input
              type="email"
              placeholder="Email address"
              className="w-full mb-6 px-4 py-2 rounded bg-[#303134] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleNext}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
            >
              Next
            </button>

            <p className="text-sm text-gray-400 mt-6 text-center">
              New here?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-red-500 cursor-pointer hover:underline"
              >
                Create account
              </span>
            </p>
          </>
        )}

        {/* STEP 2 – PASSWORD */}
        {step === 2 && (
          <>
            <h1 className="text-2xl text-white mb-4 flex items-center gap-2">
              <img src={logo} className="w-7 h-7" />
              Welcome
            </h1>

            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <FaUserCircle size={22} />
              <span>{email}</span>
            </div>

            {/* Password Input */}
            <div className="relative mb-5">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded bg-[#303134] text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              className="text-sm text-red-500 mb-6 hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full py-2 rounded font-medium transition flex items-center justify-center gap-2
    ${loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
  `}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Log in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
