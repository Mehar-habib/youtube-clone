import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaArrowDown,
  FaBookmark,
  FaComment,
  FaDownload,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import Description from "../../components/Description";
import axios from "axios";
import { serverUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const IconButton = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button onClick={onClick}>
      <div
        className={`${
          active ? "bg-white" : "bg-[#00000065] border border-gray-700"
        } p-3 rounded-full hover:bg-gray-700 transition`}
      >
        <Icon className={`${active ? "text-black" : "text-white"}`} />
      </div>
      <span className="text-xs mt-1 flex gap-1">
        {count !== undefined && ` (${count})`} <span>{label}</span>
      </span>
    </button>
  );
};
export default function Shorts() {
  const { allShortsData } = useSelector((state) => state.content);
  const { userData } = useSelector((state) => state.user);
  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewedShort, setViewedShort] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState({});
  const shortRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRefs.current[index];
          if (video) {
            if (entry.isIntersecting) {
              video.muted = false;
              video.play();

              const currentShortId = shortList[index]._id;
              if (!viewedShort.includes(currentShortId)) {
                handleAddView(currentShortId);
                setViewedShort((prev) => [...prev, currentShortId]);
              }
            } else {
              video.muted = true;
              video.pause();
            }
          }
        });
      },
      { threshold: 0.7 },
    );
    shortRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });
    return () => observer.disconnect();
  }, [shortList]);

  const togglePlay = (index) => {
    const video = shortRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayIndex(null);
      } else {
        video.pause();
        setPlayIndex(index);
      }
    }
  };
  const handleSubscribe = async (channelId) => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/user/toggle-subscribe",
        { channelId },
        { withCredentials: true },
      );
      console.log(result.data);
      setLoading(false);
      const updatedChannel = result.data;
      setShortList((prev) =>
        prev.map((short) =>
          short?.channel?._id === channelId
            ? { ...short, channel: updatedChannel }
            : short,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddView = async (shortId) => {
    try {
      await axios.put(
        `${serverUrl}/api/content/short/${shortId}/add-view`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-like`,
        {},
        { withCredentials: true },
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short,
        ),
      );
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDisLike = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-dislike`,
        {},
        { withCredentials: true },
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(
        `${serverUrl}/api/content/short/${shortId}/toggle-save`,
        {},
        { withCredentials: true },
      );
      const updatedShort = result.data;
      setShortList((prev) =>
        prev.map((short) =>
          short?._id === updatedShort._id ? updatedShort : short,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddComment = async (shortId) => {
    if (!newComment) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/add-comment`,
        { message: newComment },
        { withCredentials: true },
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: result.data.comments || [],
      }));
      setLoading(false);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddReply = async ({ commentId, replyText, shortId }) => {
    if (!replyText) return;
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/short/${shortId}/${commentId}/add-reply`,
        { message: replyText },
        { withCredentials: true },
      );
      setComments((prev) => ({
        ...prev,
        [shortId]: result.data.comments || [],
      }));
      setReplyText((prev) => ({
        ...prev,
        [commentId]: "",
      }));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!allShortsData || allShortsData.length === 0) return;
    const shuffled = [...allShortsData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);
  }, [allShortsData]);
  return (
    <div className="h-[100vh] w-full overflow-y-scroll snap-y snap-mandatory">
      {shortList?.map((short, index) => (
        <div
          key={short?._id}
          className="min-h-screen w-full flex md:items-center items-start justify-center snap-start pt-10 md:pt-0"
        >
          <div
            className="relative w-[420px] md:w-[350px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer mt-28 md:mt-0"
            onClick={() => togglePlay(index)}
          >
            <video
              src={short?.shortUrl}
              ref={(el) => (shortRefs.current[index] = el)}
              data-index={index}
              className="w-full h-full object-cover"
              loop
              playsInline
            />
            {playIndex === index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPlay className="text-white text-lg" />
              </div>
            )}

            {playIndex !== index && (
              <div className="absolute top-3 right-3 bg-black/60 rounded-full p-2">
                <FaPause className="text-white text-lg" />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
              <div className="flex items-center justify-start gap-2">
                <img
                  src={short?.channel?.avatar}
                  className="w-8 h-8 rounded-full border border-gray-700"
                  alt=""
                  onClick={() =>
                    navigate(`/channel-page/${short?.channel?._id}`)
                  }
                />
                <span
                  className="text-sm text-gray-300"
                  onClick={() =>
                    navigate(`/channel-page/${short?.channel?._id}`)
                  }
                >
                  @{short?.channel?.name}
                </span>
                <button
                  className={`${
                    short?.channel?.subscribers?.includes(userData._id)
                      ? "bg-[#000000a1] text-white border border-gray-700"
                      : "bg-white text-black"
                  } text-xs px-2.5 py-2.5 rounded-full cursor-pointer`}
                  onClick={() => handleSubscribe(short?.channel?._id)}
                >
                  {short?.channel?.subscribers?.includes(userData._id)
                    ? "Subscribed"
                    : "Subscribe"}
                </button>
              </div>
              <div className="flex items-center justify-start">
                <h3 className="font-bold text-lg line-clamp-2">
                  {short?.title}
                </h3>
              </div>
              <div>
                {short?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div>
                <Description text={short?.description} />
              </div>

              <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 text-white">
                <IconButton
                  icon={FaThumbsUp}
                  label={"Likes"}
                  active={short?.likes?.includes(userData._id)}
                  count={short?.likes.length}
                  onClick={() => toggleLike(short?._id)}
                />

                <IconButton
                  icon={FaThumbsDown}
                  label={"Dislikes"}
                  active={short?.disLikes?.includes(userData._id)}
                  count={short?.disLikes?.length}
                  onClick={() => toggleDisLike(short?._id)}
                />
                <IconButton
                  icon={FaComment}
                  label={"Comment"}
                  onClick={() => {
                    setOpenComment(!openComment);
                    setComments((prev) => ({
                      ...prev,
                      [short._id]: short.comments,
                    }));
                  }}
                />

                <IconButton
                  icon={FaDownload}
                  label={"Download"}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = short?.shortUrl;
                    link.download = `${short?.title}.mp4`;
                    link.click();
                  }}
                />

                <IconButton
                  icon={FaBookmark}
                  label={"Save"}
                  active={short?.saveBy?.includes(userData._id)}
                  onClick={() => toggleSave(short?._id)}
                />
              </div>
            </div>
            {/* comment div */}
            {openComment && (
              <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg">Comment</h3>
                  <button>
                    <FaArrowDown
                      size={20}
                      onClick={() => setOpenComment(!openComment)}
                    />
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900 text-white p-2 rounded"
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="bg-black px-4 py-2 border border-gray-700 rounded-xl"
                    onClick={() => handleAddComment(short?._id)}
                  >
                    Post
                  </button>
                </div>
                <div className="space-y-3 mt-4">
                  {comments[short._id]?.length > 0 ? (
                    comments[short._id].map((comment) => (
                      <div
                        key={comment?._id}
                        className="bg-gray-800/40 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={comment?.author?.photoUrl}
                            alt=""
                            className="w-6 h-6 rounded-full"
                          />
                          <h3 className="text-sm font-semibold">
                            {comment?.author?.userName}
                          </h3>
                        </div>
                        <p className="text-sm ml-8">{comment?.message}</p>
                        <button
                          onClick={() => setReply(!reply)}
                          className="text-red-500 ml-8 mt-2"
                        >
                          reply
                        </button>

                        {reply && (
                          <div className="mt-2 ml-8 flex gap-2">
                            <input
                              type="text"
                              className="w-full bg-gray-900 text-white text-sm p-2 rounded"
                              placeholder="Add a reply"
                              value={replyText[comment._id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              className="bg-red-500 px-3 py-1 rounded text-xs"
                              onClick={() => {
                                handleAddReply({
                                  shortId: short._id,
                                  commentId: comment._id,
                                  replyText: replyText[comment._id],
                                });
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment._id]: "",
                                }));
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        )}

                        <div className="ml-12 mt-2 space-y-2">
                          {comment?.replies.map((reply) => (
                            <div
                              key={reply?._id}
                              className="bg-gray-800/40 p-2 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <img
                                  src={reply?.author?.photoUrl}
                                  alt=""
                                  className="w-6 h-6 rounded-full"
                                />
                                <h3 className="text-sm font-semibold">
                                  {reply?.author?.userName}
                                </h3>
                              </div>
                              <p className="text-sm ml-8">{reply?.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No Comments yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
