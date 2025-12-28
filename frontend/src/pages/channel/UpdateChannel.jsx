import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/youtube.png";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";
import { setChannelData } from "../../redux/userSlice";
export default function UpdateChannel() {
  const { channelData } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [channelName, setChannelName] = useState(channelData?.name);
  const [category, setCategory] = useState(channelData?.category);
  const [description, setDescription] = useState(channelData?.description);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatar = (e) => setAvatar(e.target.files[0]);
  const handleBanner = (e) => setBanner(e.target.files[0]);

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const handleUpdateChannel = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("banner", banner);
    formData.append("name", channelName);
    formData.append("category", category);
    formData.append("description", description);

    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/update-channel",
        formData,
        {
          withCredentials: true,
        }
      );
      dispatch(setChannelData(result.data));
      showCustomAlert("Channel created successfully", "success");
      navigate("/");
    } catch (error) {
      showCustomAlert(error.response?.data?.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Main */}
      <main className="flex justify-center items-center mt-10">
        <div className="w-full max-w-md bg-[#181818] rounded-xl shadow-lg p-6">
          {/* Steps Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-10 rounded-full ${
                  step >= s ? "bg-red-600" : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 text-center">
              <h2 className="text-xl font-semibold">Customize Channel</h2>
              <p className="text-sm text-gray-400">
                Choose profile picture & channel name
              </p>

              <label className="flex flex-col items-center gap-2 cursor-pointer">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-24 h-24 text-gray-600" />
                )}
                <span className="text-sm text-blue-500">Upload avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatar}
                />
              </label>

              <input
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                placeholder="Channel name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />

              <button
                onClick={nextStep}
                disabled={!channelName}
                className="w-full bg-red-600 py-2 rounded-lg disabled:opacity-50"
              >
                Continue
              </button>

              <span
                onClick={() => navigate("/")}
                className="text-sm text-gray-400 cursor-pointer hover:text-white"
              >
                Back to home
              </span>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 text-center">
              <h2 className="text-xl font-semibold">Your Updated Channel</h2>

              <div className="flex flex-col items-center gap-3">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-gray-600" />
                )}
                <h3 className="font-medium">{channelName}</h3>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-red-600 py-2 rounded-lg"
              >
                Customize Channel
              </button>

              <span
                onClick={prevStep}
                className="text-sm text-gray-400 cursor-pointer"
              >
                Back
              </span>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center">
                Customize Channel
              </h2>

              <label className="block cursor-pointer">
                {banner ? (
                  <img
                    src={URL.createObjectURL(banner)}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center border border-dashed border-gray-600 rounded-lg text-sm text-gray-400">
                    Upload banner image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleBanner}
                />
              </label>

              <textarea
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2"
                rows={3}
                placeholder="Channel description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-2"
                placeholder="Channel category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <button
                disabled={!description || !category || loading}
                className="w-full bg-red-600 py-2 rounded-lg disabled:opacity-50"
                onClick={handleUpdateChannel}
              >
                {loading ? "updating..." : "Update Channel"}
              </button>

              <span
                onClick={prevStep}
                className="block text-center text-sm text-gray-400 cursor-pointer"
              >
                Back
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
