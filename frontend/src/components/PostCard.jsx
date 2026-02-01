import { FaComment, FaHeart } from "react-icons/fa";

const PostCard = ({ post }) => {
  return (
    <div className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-2xl mx-auto">
      {/* Post Content */}
      <p className="text-gray-100 font-semibold  p-1 leading-relaxed mb-3">
        {post.content}
      </p>

      {/* Post Image */}
      {post?.image && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img
            src={post.image}
            alt="Post"
            className="w-full max-h-[420px] object-cover hover:scale-105 transition duration-300"
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-gray-400 text-xs sm:text-sm">
        {/* Date */}
        <span>{new Date(post.createdAt).toDateString()}</span>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Like */}
          <button className="flex items-center gap-1 hover:text-red-500 transition">
            <FaHeart className="text-sm" />
            <span className="hidden sm:inline">Like</span>
          </button>

          {/* Comment */}
          <button className="flex items-center gap-1 hover:text-blue-400 transition">
            <FaComment className="text-sm" />
            <span className="hidden sm:inline">Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
