"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaComment, FaShare, FaEllipsisH } from "react-icons/fa";
import Image from "next/image";

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image?: string;
  author: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  tags: string[];
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
}

const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment("");
    }
  };

  // Get author initial with fallback
  const getAuthorInitial = (author: string | undefined) => {
    if (!author) return "?";
    return author[0].toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {getAuthorInitial(post.author)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {post.author || "Anonymous"}
            </h3>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaEllipsisH className="text-gray-500" />
          </button>
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Report
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Share
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4">
        <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
        <p className="mt-2 text-gray-600">{post.description}</p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mt-4 relative h-64">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Tags */}
      <div className="px-4 mt-4 flex flex-wrap gap-2">
        {post.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            isLiked ? "text-red-500" : "text-gray-500"
          }`}
        >
          <FaHeart className={isLiked ? "fill-current" : ""} />
          <span>{post.likes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-500"
        >
          <FaComment />
          <span>{post.comments?.length || 0}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-500">
          <FaShare />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100">
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Post
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">
                    {getAuthorInitial(comment.author)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm">
                      {comment.author || "Anonymous"}
                    </p>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
