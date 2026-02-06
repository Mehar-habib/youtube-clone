import { useState } from "react";
import {
  FaEdit,
  FaVideo,
  FaList,
  FaUsers,
  FaTrash,
  FaEye,
  FaCalendar,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setChannelData } from "../redux/userSlice";
import { showCustomAlert } from "./CustomAlert";

const Content = () => {
  const dispatch = useDispatch();
  const { channelData } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();

  const handleDeletePost = async (postId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete(`${serverUrl}/api/content/delete-post/${postId}`, {
        withCredentials: true,
      });
      // update redux state by filtering out deleted post
      const updatedPost = channelData?.communityPosts?.filter(
        (post) => post._id !== postId,
      );
      dispatch(setChannelData({ ...channelData, communityPosts: updatedPost }));
      showCustomAlert("Post deleted successfully", "success");
    } catch (error) {
      showCustomAlert(
        error.response?.data?.message || "Failed to delete post",
        "error",
      );
    }
  };

  const tabs = [
    {
      id: "Videos",
      icon: <FaVideo className="text-lg" />,
      count: channelData?.videos?.length || 0,
    },
    {
      id: "Shorts",
      icon: <SiYoutubeshorts className="text-lg" />,
      count: channelData?.shorts?.length || 0,
    },
    {
      id: "Playlists",
      icon: <FaList className="text-lg" />,
      count: channelData?.playlists?.length || 0,
    },
    {
      id: "Community",
      icon: <FaUsers className="text-lg" />,
      count: channelData?.communityPosts?.length || 0,
    },
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Content Manager</h1>
        <p className="text-gray-400">
          Manage your videos, shorts, playlists, and community posts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 md:px-6 relative transition-all ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon}
            <span className="font-medium whitespace-nowrap">{tab.id}</span>
            <span className="px-2 py-1 text-xs bg-gray-800 rounded-full">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
        {/* Videos Tab */}
        {activeTab === "Videos" && (
          <div className="p-4 md:p-6">
            {channelData?.videos?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <FaVideo className="text-2xl text-gray-500" />
                </div>
                <p className="text-gray-400">No videos uploaded yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Start creating content!
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-800">
                      <tr className="text-left text-gray-400">
                        <th className="pb-3 font-medium">Thumbnail</th>
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Views</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelData?.videos?.map((video) => (
                        <tr
                          key={video._id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="py-4">
                            <img
                              src={video?.thumbnail}
                              alt={video?.title}
                              className="w-24 h-14 rounded-lg object-cover"
                            />
                          </td>
                          <td className="py-4">
                            <div>
                              <h3 className="font-medium text-white">
                                {video?.title}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(video.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1 text-gray-300">
                              <FaEye className="text-sm" />
                              <span>{formatNumber(video?.views || 0)}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-video/${video?._id}`,
                                )
                              }
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {channelData?.videos?.map((video) => (
                    <div
                      key={video._id}
                      className="bg-[#222] rounded-xl p-4 border border-gray-800"
                    >
                      <div className="flex gap-4">
                        <img
                          src={video?.thumbnail}
                          alt={video?.title}
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm line-clamp-2">
                            {video?.title}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <FaEye className="text-xs" />
                                <span>{formatNumber(video?.views || 0)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaCalendar className="text-xs" />
                                <span>
                                  {new Date(
                                    video.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-video/${video?._id}`,
                                )
                              }
                            >
                              <FaEdit className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Shorts Tab */}
        {activeTab === "Shorts" && (
          <div className="p-4 md:p-6">
            {channelData?.shorts?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <SiYoutubeshorts className="text-2xl text-gray-500" />
                </div>
                <p className="text-gray-400">No shorts uploaded yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create your first short!
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-800">
                      <tr className="text-left text-gray-400">
                        <th className="pb-3 font-medium">Preview</th>
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Views</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelData?.shorts?.map((short) => (
                        <tr
                          key={short._id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="py-4">
                            <video
                              src={short?.shortUrl}
                              className="w-20 h-32 rounded-lg object-cover"
                              muted
                              playsInline
                            />
                          </td>
                          <td className="py-4">
                            <div>
                              <h3 className="font-medium text-white">
                                {short?.title}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(short.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1 text-gray-300">
                              <FaEye className="text-sm" />
                              <span>{formatNumber(short?.views || 0)}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-short/${short?._id}`,
                                )
                              }
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {channelData?.shorts?.map((short) => (
                    <div
                      key={short._id}
                      className="bg-[#222] rounded-xl p-4 border border-gray-800"
                    >
                      <div className="flex gap-4">
                        <video
                          src={short?.shortUrl}
                          className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                          muted
                          playsInline
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm line-clamp-2">
                            {short?.title}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <FaEye className="text-xs" />
                                <span>{formatNumber(short?.views || 0)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaCalendar className="text-xs" />
                                <span>
                                  {new Date(
                                    short.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-short/${short?._id}`,
                                )
                              }
                            >
                              <FaEdit className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Playlists Tab */}
        {activeTab === "Playlists" && (
          <div className="p-4 md:p-6">
            {channelData?.playlists?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <FaList className="text-2xl text-gray-500" />
                </div>
                <p className="text-gray-400">No playlists created yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Create your first playlist!
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-800">
                      <tr className="text-left text-gray-400">
                        <th className="pb-3 font-medium">Thumbnail</th>
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Videos</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelData?.playlists?.map((playlist) => (
                        <tr
                          key={playlist._id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="py-4">
                            <img
                              src={playlist?.videos?.[0]?.thumbnail}
                              alt={playlist?.title}
                              className="w-24 h-14 rounded-lg object-cover"
                            />
                          </td>
                          <td className="py-4">
                            <div>
                              <h3 className="font-medium text-white">
                                {playlist?.title}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {new Date(
                                  playlist.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1 text-gray-300">
                              <FaVideo className="text-sm" />
                              <span>
                                {playlist?.videos?.length || 0} videos
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-playlist/${playlist?._id}`,
                                )
                              }
                            >
                              <FaEdit />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {channelData?.playlists?.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="bg-[#222] rounded-xl p-4 border border-gray-800"
                    >
                      <div className="flex gap-4">
                        <img
                          src={playlist?.videos?.[0]?.thumbnail}
                          alt={playlist?.title}
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm line-clamp-2">
                            {playlist?.title}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <div className="flex items-center gap-1">
                                <FaVideo className="text-xs" />
                                <span>
                                  {playlist?.videos?.length || 0} videos
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaCalendar className="text-xs" />
                                <span>
                                  {new Date(
                                    playlist.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                              onClick={() =>
                                navigate(
                                  `/yt-studio/update-playlist/${playlist?._id}`,
                                )
                              }
                            >
                              <FaEdit className="text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === "Community" && (
          <div className="p-4 md:p-6">
            {channelData?.communityPosts?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <FaUsers className="text-2xl text-gray-500" />
                </div>
                <p className="text-gray-400">No community posts yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Engage with your community!
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-800">
                      <tr className="text-left text-gray-400">
                        <th className="pb-3 font-medium">Preview</th>
                        <th className="pb-3 font-medium">Content</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {channelData?.communityPosts?.map((post) => (
                        <tr
                          key={post._id}
                          className="border-b border-gray-800/50 hover:bg-gray-800/30"
                        >
                          <td className="py-4">
                            {post?.image ? (
                              <img
                                src={post?.image}
                                alt="Post"
                                className="w-24 h-14 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-24 h-14 rounded-lg bg-gray-800 flex items-center justify-center">
                                <FaUsers className="text-xl text-gray-600" />
                              </div>
                            )}
                          </td>
                          <td className="py-4 max-w-md">
                            <div>
                              <p className="text-white line-clamp-2">
                                {post?.content}
                              </p>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1 text-gray-300">
                              <FaCalendar className="text-sm" />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <button
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              <MdDelete />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {channelData?.communityPosts?.map((post) => (
                    <div
                      key={post._id}
                      className="bg-[#222] rounded-xl p-4 border border-gray-800"
                    >
                      <div className="flex gap-4">
                        {post?.image ? (
                          <img
                            src={post?.image}
                            alt="Post"
                            className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <FaUsers className="text-lg text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white text-sm line-clamp-3">
                            {post?.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <FaCalendar className="text-xs" />
                              <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <button
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"
                              onClick={() => handleDeletePost(post._id)}
                            >
                              <MdDelete className="text-sm text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
