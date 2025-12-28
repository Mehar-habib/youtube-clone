// import { useSelector } from "react-redux";
// import logo from "../../assets/youtube.png";
// import { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { serverUrl } from "../../App";
// import { showCustomAlert } from "../../components/CustomAlert";
// export default function CreateChannel() {
//   const { userData } = useSelector((state) => state.user);
//   const [step, setStep] = useState(1);
//   const [avatar, setAvatar] = useState(null);
//   const [channelName, setChannelName] = useState("");
//   const [banner, setBanner] = useState(null);
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const handleAvatar = (e) => {
//     setAvatar(e.target.files[0]);
//   };
//   const handleBanner = (e) => {
//     setBanner(e.target.files[0]);
//   };
//   const nextStep = ()=> {setStep((prev) => prev + 1);};
//   const prevStep = ()=> {setStep((prev) => prev - 1);};

//   const handleCreateChannel = async () => {
//     const formData = new FormData();
//     formData.append("avatar", avatar);
//     formData.append("banner", banner);
//     formData.append("name", channelName);
//     formData.append("category", category);
//     formData.append("description", description);
//     setLoading(true);
//     try {
//       const result = await axios.post(serverUrl+"/api/user/create-channel", formData, {
//         withCredentials: true,})
//         console.log(result.data);
//         setLoading(false);
//         showCustomAlert("Channel Created", "success");
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       showCustomAlert(error.response.data.message, "error");
//     }
//   };
//   return (
//     <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col">
//       <header>
//         <div>
//           <img src={logo} alt="" />
//           <span>YouTube</span>
//         </div>
//         <div>
//           <img src={userData?.photoUrl} alt="" />
//         </div>
//       </header>

//     {/* main */}
//     <main>
//         <div>
//             {step == 1 &&(
//                 <div>
//                     <h2>How you'll appear</h2>
//                     <p>Choose your profile picture, channel name</p>

//                         <div>
//                             <label htmlFor="avatar">
//                                 {avatar ? <img src={URL.createObjectURL(avatar)} alt=""/> :<div><FaUserCircle/></div>}
//                                 <span>upload avatar</span>
//                             <input type="text" className="hidden" id="avatar" accept="image/*" onChange={handleAvatar} />
//                             </label>
//                         </div>
//                         <input type="text" placeholder="Channel name" onChange={(e) => setChannelName(e.target.value)} value={channelName} />

//                         <button onClick={nextStep} disabled={!channelName}>Continue</button>
//                         <span onClick={()=> navigate("/")}>Back to home</span>
//                 </div>
//             )}

//             {/* step 2 */}
//             {step == 2 &&(
//                 <div>
//                     <h2>Your Channel</h2>
//                         <div>
//                             <label>
//                                 {avatar ? <img src={URL.createObjectURL(avatar)} alt=""/> :<div><FaUserCircle/></div>}

//                             </label>

//                             <h2>{channelName}</h2>
//                         </div>

//                         <button onClick={nextStep} disabled={!channelName}>Continue and create channel</button>
//                         <span onClick={prevStep}>Back</span>
//                 </div>
//             )}

//             {/* step 3 */}
//             {step == 1 &&(
//                 <div>
//                     <h2>Create Channel</h2>

//                         <div>
//                             <label htmlFor="banner">
//                                 {banner ? <img src={URL.createObjectURL(banner)} alt=""/> :<div>Click to upload banner image</div>}

//                                 <span>upload banner Image</span>
//                             <input type="text" className="hidden" id="banner" accept="image/*" onChange={handleBanner} />
//                             </label>
//                         </div>
//                         <textarea placeholder="Channel Description" onChange={(e) => setDescription(e.target.value)} value={description} />
//                         <input type="text" placeholder="Channel category" onChange={(e) => setCategory(e.target.value)} value={category} />

//                         <button onClick={handleCreateChannel} disabled={!description || !category || loading}>{ loading ? "Creating channel..." :"Save and create channel"}</button>
//                         <span onClick={prevStep}>Back</span>
//                 </div>
//             )}
//         </div>
//     </main>
//     </div>
//   );
// }

import { useSelector } from "react-redux";
import logo from "../../assets/youtube.png";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../../App";
import { showCustomAlert } from "../../components/CustomAlert";

export default function CreateChannel() {
  const { userData } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [channelName, setChannelName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAvatar = (e) => setAvatar(e.target.files[0]);
  const handleBanner = (e) => setBanner(e.target.files[0]);

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  const handleCreateChannel = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    formData.append("banner", banner);
    formData.append("name", channelName);
    formData.append("category", category);
    formData.append("description", description);

    setLoading(true);
    try {
      await axios.post(serverUrl + "/api/user/create-channel", formData, {
        withCredentials: true,
      });
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
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src={logo} className="w-8" />
          <span className="font-semibold text-lg">YouTube</span>
        </div>
        <img
          src={userData?.photoUrl}
          className="w-9 h-9 rounded-full object-cover"
        />
      </header>

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
              <h2 className="text-xl font-semibold">How you’ll appear</h2>
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
              <h2 className="text-xl font-semibold">Your Channel</h2>

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
                Continue
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
                Create Channel
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
                onClick={handleCreateChannel}
                disabled={!description || !category || loading}
                className="w-full bg-red-600 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Channel"}
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
