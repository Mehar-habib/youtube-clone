// import axios from "axios";
// import { useEffect, useState } from "react";
// import { serverUrl } from "../../App";
// import { FaList } from "react-icons/fa";
// import PlaylistCard from "../../components/PlaylistCard";

// const SavedPlaylist = () => {
//     const [savedPlaylist, setSavedPlaylist] = useState([]);

//     useEffect(() => {
//         const fetchedSavedPlaylist = async () => {
//           try {
//             const result = await axios.get(serverUrl+"/api/playlist/saved-playlist", {
//               withCredentials: true,
//             })
//             setSavedPlaylist(result.data);
//           } catch (error) {
//             console.error(error);
//           }
//         };
//         fetchedSavedPlaylist();
//     }, []);
//   return (
//     <div>
//         <h2><FaList/>Saved Playlist</h2>

//         <div>
//             {savedPlaylist?.map((pl)=>(
//                 <PlaylistCard key={pl._id} id={pl._id} title={pl.title} videos={pl.videos} savedBy={pl.saveBy} />
//             ))}
//         </div>
//     </div>
//   );
// };

// export default SavedPlaylist;

import axios from "axios";
import { useEffect, useState } from "react";
import { serverUrl } from "../../App";
import { FaList } from "react-icons/fa";
import PlaylistCard from "../../components/PlaylistCard";

const SavedPlaylist = () => {
  const [savedPlaylist, setSavedPlaylist] = useState([]);

  useEffect(() => {
    const fetchedSavedPlaylist = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/content/saved-playlist",
          {
            withCredentials: true,
          },
        );
        setSavedPlaylist(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchedSavedPlaylist();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 mt-12 lg:mt-5">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-3 mb-6 text-white">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272727]">
          <FaList className="text-sm text-gray-300" />
          <h2 className="text-sm font-semibold">Saved Playlists</h2>
        </div>
      </div>

      {/* ---------- PLAYLISTS ---------- */}
      {savedPlaylist.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedPlaylist.map((pl) => (
            <PlaylistCard
              key={pl._id}
              id={pl._id}
              title={pl.title}
              videos={pl.videos}
              savedBy={pl.saveBy}
            />
          ))}
        </div>
      ) : (
        /* ---------- EMPTY STATE ---------- */
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 text-center">
          <FaList className="text-5xl mb-4 opacity-40" />
          <p className="text-lg font-medium">No saved playlists</p>
          <p className="text-sm mt-1">Save playlists to see them here</p>
        </div>
      )}
    </div>
  );
};

export default SavedPlaylist;
