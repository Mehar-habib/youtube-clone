import axios from "axios";
import { useState } from "react";
import {
  FaComment,
  FaHeart,
  FaTimes,
  FaPaperPlane,
  FaReply,
  FaRegHeart,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { serverUrl } from "../App";

const PostCard = ({ post }) => {
  const { userData } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(
    post.likes?.some((u) => u.toString() === userData?._id?.toString()) ||
      false,
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post?.comments || []);

  const handleLike = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/toggle-like`,
        { postId: post._id },
        { withCredentials: true },
      );
      setLikeCount(result.data.likes?.length);
      setLiked(result.data.likes.includes(userData._id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-comment`,
        { message: newComment, postId: post?._id },
        { withCredentials: true },
      );
      setComments((prev) => [result.data?.comments.slice(-1)[0], ...prev]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommentReply = async ({ commentId, replyText }) => {
    if (!replyText.trim()) return;
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/content/post/add-reply`,
        { message: replyText, commentId, postId: post?._id },
        { withCredentials: true },
      );
      setComments(result.data.comments);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] border border-gray-800 rounded-xl p-3 mb-3 hover:bg-[#1f1f1f] transition-all duration-200 max-w-sm w-full sm:max-w-md">
      {/* Post Content - Compact */}
      <p className="text-gray-100 mb-3 text-sm leading-snug line-clamp-3 hover:line-clamp-none cursor-pointer">
        {post.content}
      </p>

      {/* Post Image */}
      {post?.image && (
        <div className="rounded-lg overflow-hidden mb-3">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-auto max-h-[280px] object-cover"
          />
        </div>
      )}

      {/* Stats & Actions - Compact */}
      <div className="flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-500 text-xs" />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaComment className="text-blue-400 text-xs" />
            <span>{comments.length}</span>
          </div>
          <span className="text-gray-500">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            title={liked ? "Unlike" : "Like"}
          >
            {liked ? (
              <FaHeart className="text-red-500 text-sm" />
            ) : (
              <FaRegHeart className="text-gray-400 text-sm hover:text-red-500" />
            )}
          </button>

          <button
            onClick={() => setShowComments(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            title="Comment"
          >
            <FaComment className="text-gray-400 text-sm hover:text-blue-400" />
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-2 pb-2 sm:p-2">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          />

          {/* Modal Content - Responsive */}
          <div className="relative w-full max-w-sm sm:max-w-md max-h-[85vh] bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">Comments</h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Comment Input */}
            <div className="p-3 border-b border-gray-800">
              <div className="flex gap-2">
                <img
                  src={userData?.photoUrl}
                  alt="Your profile"
                  className="w-7 h-7 rounded-full flex-shrink-0"
                />
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loading}
                    className={`px-2 rounded-lg flex items-center ${
                      !newComment.trim() || loading
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {loading ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <FaPaperPlane size={12} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="overflow-y-auto max-h-[60vh] p-3">
              {comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      handleReply={handleAddCommentReply}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 text-sm">No comments yet</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Be the first to comment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, handleReply, loading }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="group">
      <div className="flex gap-2">
        <img
          src={comment?.author?.photoUrl}
          alt={comment?.author?.userName}
          className="w-6 h-6 rounded-full flex-shrink-0 mt-1"
        />
        <div className="flex-1">
          <div className="bg-gray-900 rounded-lg p-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-xs text-white">
                {comment?.author?.userName}
              </span>
              <span className="text-xs text-gray-400">
                • {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-200 text-xs">{comment?.message}</p>
          </div>

          <div className="mt-1 ml-1">
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-gray-400 hover:text-blue-400 flex items-center gap-1"
            >
              <FaReply size={9} />
              Reply
            </button>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  handleReply({ commentId: comment._id, replyText }) &&
                  setReplyText("")
                }
              />
              <button
                onClick={() => {
                  handleReply({ commentId: comment._id, replyText });
                  setReplyText("");
                  setShowReplyInput(false);
                }}
                disabled={!replyText.trim() || loading}
                className={`px-2 rounded-lg text-xs ${
                  !replyText.trim() || loading
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          )}

          {/* Replies */}
          {comment?.replies?.length > 0 && (
            <div className="mt-2 ml-4 space-y-2 border-l border-gray-800 pl-3">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex gap-2">
                  <img
                    src={reply?.author?.photoUrl}
                    alt={reply?.author?.userName}
                    className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-1.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-xs text-white">
                          {reply?.author?.userName}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs">{reply?.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
