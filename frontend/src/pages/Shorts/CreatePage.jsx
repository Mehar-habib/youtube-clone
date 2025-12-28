// import { useState } from "react";
// import { FaList, FaPen, FaPlay, FaVideo } from "react-icons/fa";
// import logo from "../../assets/youtube.png";

// export default function CreatePage() {
//   const [selected, setSelected] = useState(false);
//   const option = [
//     {id: "video", icon: <FaVideo />, title: "Upload video"},
//     {id: "short", icon: <FaPlay />, title: "Create short"},
//     {id: "post", icon: <FaPen />, title: "Create community post"},
//     {id: "playlist", icon: <FaList />, title: "New Playlist"},
//   ];

//   return <div className="bg-[#0f0f0f] min-h-screen text-white px-6 py-8 mt-10 flex flex-col">
//     <header>
//       <h1>Create</h1>
//       <p>Choose what type of content you want to create for your audience</p>
//     </header>
//     <div>
//       {option.map((opt) => (
//         <div className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-6 flex flex-col items-center text-center justify-center cursor-pointer transition ${selected === opt.id ? "ring-2 ring-red-500" : "hover:bg-[#272727]"}`} onClick={()=> setSelected(opt.id)}>
//           <div>{opt.title}</div>
//         </div>
//       ))}
//     </div>
//       <div>
//       <img src={logo} alt="" />
//       {!selected ? <div>
//         <p>create content on any device</p>
//         <p>Upload and record at home or on the go. Everything you make public will appear here.</p>
//       </div> : <div>
//          <p>Ready to create?</p>
//         <p>Click below to start your {option.find((opt) => opt.id === selected)?.title}</p>
//         <button>+ Create</button>
//         </div>}
//       </div>
//   </div>;
// }

import { useState } from "react";
import { FaList, FaPen, FaPlay, FaVideo } from "react-icons/fa";
import logo from "../../assets/youtube.png";

export default function CreatePage() {
  const [selected, setSelected] = useState(null);

  const options = [
    { id: "video", icon: <FaVideo />, title: "Upload video" },
    { id: "short", icon: <FaPlay />, title: "Create Short" },
    { id: "post", icon: <FaPen />, title: "Community Post" },
    { id: "playlist", icon: <FaList />, title: "New Playlist" },
  ];

  const selectedOption = options.find((opt) => opt.id === selected);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-10 max-w-xl">
        <h1 className="text-3xl font-semibold mb-2">Create</h1>
        <p className="text-gray-400">
          Choose what type of content you want to create for your audience
        </p>
      </header>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        {options.map((opt) => (
          <div
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`group cursor-pointer rounded-xl border transition-all duration-200 p-6 flex flex-col items-center text-center
              ${
                selected === opt.id
                  ? "border-red-500 bg-[#1f1f1f] ring-2 ring-red-500"
                  : "border-[#2a2a2a] bg-[#181818] hover:bg-[#202020]"
              }
            `}
          >
            <div
              className={`text-3xl mb-4 transition ${
                selected === opt.id
                  ? "text-red-500"
                  : "text-gray-400 group-hover:text-white"
              }`}
            >
              {opt.icon}
            </div>
            <h3 className="font-medium">{opt.title}</h3>
          </div>
        ))}
      </div>

      {/* Bottom Info / CTA */}
      <div className="w-full max-w-2xl bg-[#181818] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col items-center text-center gap-4">
        <img src={logo} alt="YouTube" className="w-10 opacity-90" />

        {!selected ? (
          <>
            <p className="text-lg font-medium">Create content on any device</p>
            <p className="text-gray-400 text-sm">
              Upload and record at home or on the go. Everything you make public
              will appear here.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium">Ready to create?</p>
            <p className="text-gray-400 text-sm">
              Click below to start your{" "}
              <span className="text-white font-medium">
                {selectedOption?.title}
              </span>
            </p>
            <button className="mt-2 bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded-lg font-medium">
              + Create
            </button>
          </>
        )}
      </div>
    </div>
  );
}
