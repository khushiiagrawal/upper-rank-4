"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaComment, FaShare, FaEllipsisH } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext"; // Add this import

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  image?: string;
  author: string;
  timestamp: string;
  likes: number;
  userId?: string; // Add this property to the Post interface
  comments: Comment[];
  tags: string[];
  postType?: "text" | "image" | "poll";
  pollOptions?: { text: string; votes: number }[];
  totalVotes?: number;
  userVote?: number | null;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onVote?: (postId: string, optionIndex: number) => void;
}

const PostCard = ({ post, onLike, onComment, onVote }: PostCardProps) => {
  const { user } = useAuth(); // Get the authenticated user
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  // Set mounted state after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
        }), // We only need to send the text; the API will get author from token
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post comment");
      }

      const newComment = await response.json();

      // Update the local state to show the new comment immediately
      const updatedComments = [...(post.comments || []), newComment];
      post.comments = updatedComments;

      // Call the parent component's callback
      onComment(post._id, newComment);

      // Clear the input field
      setCommentText("");
    } catch (error) {
      console.error("Error commenting on post:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: post.title,
        text: post.description,
        url: `${window.location.origin}/community/post/${post._id}`,
      };

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  // Ensure comments is always an array
  const comments = Array.isArray(post.comments) ? post.comments : [];

  // Get author initial with proper fallback
  const getAuthorInitial = (author: string | undefined | null) => {
    if (!author || typeof author !== "string") return "U"; // Changed from "?" to "U" for "User"
    return author.charAt(0).toUpperCase();
  };

  // Format timestamp consistently
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return timestamp;
    }
  };

  // More robust author display logic
  const displayAuthor = () => {
    // For new posts created by this user
    if (post.author === user?.name) return user.name;

    // For posts with a valid author name
    if (post.author && post.author !== "Anonymous") return post.author;

    // For legacy "Anonymous" posts that belong to this user (if you have a userId field)
    if (user && post.userId === user.id) return user.name;

    // Default fallback
    return post.author || "User";
  };

  // Return loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">?</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Loading...</h3>
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Post Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {getAuthorInitial(post.author)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{displayAuthor()}</h3>
            <p className="text-sm text-gray-500">
              {formatTimestamp(post.timestamp)}
            </p>
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

      {/* Poll Section */}
      {post.postType === "poll" && post.pollOptions && mounted && (
        <div className="px-4 py-3">
          <div className="space-y-2">
            {post.pollOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onVote && onVote(post._id, index)}
                className={`w-full p-3 rounded-lg border ${
                  post.userVote === index
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-500"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{option.text}</span>
                  <span className="text-sm text-gray-500">
                    {option.votes} votes
                  </span>
                </div>
                {post.totalVotes && post.totalVotes > 0 && (
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${(option.votes / post.totalVotes) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Total votes: {post.totalVotes || 0}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
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
          } hover:text-red-500 transition-colors`}
        >
          <FaHeart className={isLiked ? "fill-current" : ""} />
          <span>{likesCount}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <FaComment className="text-sm text-black" />
          <span>{comments.length} Comments</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
        >
          <FaShare />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && mounted && (
        <div className="px-4 py-2 border-t">
          <div className="mt-2">
            <form onSubmit={handleComment} className="mb-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="text-black  flex-1 px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-2">
              {comments.map((comment, index) => (
                <div
                  key={comment.id || index}
                  className="bg-gray-50 p-2 rounded-lg"
                >
                  <p className="text-sm font-medium text-green-500">
                    {comment.author || user?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
