import { useState } from "react";
import logo from "../assets/youtube.png";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(3);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-[#202124] text-white">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-gray-700">
        <img src={logo} alt="YouTube Logo" className="w-8 h-8" />
        <span className="text-xl font-semibold">YouTube</span>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <div className="w-full max-w-md bg-[#282828] p-8 rounded-2xl shadow-lg border border-gray-700">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Forgot Your Password?
              </h2>
              <p className="text-gray-400 mb-6 text-center">
                Enter your email address to receive a verification code.
              </p>
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 rounded bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 transition py-2 rounded font-medium"
                >
                  Send OTP
                </button>
              </form>
              <p
                className="mt-4 text-sm text-gray-400 cursor-pointer text-center hover:underline"
                onClick={() => navigate("/signin")}
              >
                Back to sign in
              </p>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Enter OTP
              </h2>
              <p className="text-gray-400 mb-6 text-center">
                Please enter the 4-digit code sent to your email.
              </p>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="OTP"
                  className="w-full px-4 py-2 rounded bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 transition py-2 rounded font-medium"
                >
                  Verify OTP
                </button>
              </form>
              <p
                className="mt-4 text-sm text-gray-400 cursor-pointer text-center hover:underline"
                onClick={() => navigate("/signin")}
              >
                Back to sign in
              </p>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Reset Password
              </h2>
              <p className="text-gray-400 mb-6 text-center">
                Enter a new password to regain access to your account.
              </p>
              <form className="flex flex-col gap-4">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-2 rounded bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 rounded bg-[#1f1f1f] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 transition py-2 rounded font-medium"
                >
                  Reset Password
                </button>
              </form>
              <p
                className="mt-4 text-sm text-gray-400 cursor-pointer text-center hover:underline"
                onClick={() => navigate("/signin")}
              >
                Back to sign in
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
