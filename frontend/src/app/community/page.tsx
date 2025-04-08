"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  FaImage,
  FaTags,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaFilter,
  FaSearch,
  FaUpload,
  FaPlus,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";

// Define the Comment type
interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

// Define the Post type to match PostCard component
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

// Define the API response type
interface ApiPost {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  image?: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  createdAt?: string;
  timestamp?: string;
  likes?: number;
  comments?: Comment[];
  tags?: string[];
}

// Main Community Page component
const CommunityPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();

        // Transform the data to match our Post interface
        const transformedPosts = data.map((post: ApiPost) => ({
          id: post._id || post.id || Date.now().toString(),
          title: post.title,
          description: post.description,
          image: post.imageUrl || post.image,
          author: post.author?.name || "Anonymous",
          timestamp:
            post.createdAt || post.timestamp || new Date().toISOString(),
          likes: post.likes || 0,
          comments: post.comments || [],
          tags: post.tags || [],
        }));

        setPosts(transformedPosts);
        // Extract unique tags from posts
        const uniqueTags = [
          ...new Set(transformedPosts.flatMap((post: Post) => post.tags)),
        ];
        setTags(uniqueTags as string[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle creating a new post
  const handleCreatePost = async (postData: FormData) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: postData,
      });
      if (!response.ok) throw new Error("Failed to create post");
      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Filter posts based on search query and selected tags
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  // Handle like post
  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "like" }),
      });

      if (!response.ok) throw new Error("Failed to like post");

      // Update the posts state
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle comment on post
  const handleCommentPost = async (postId: string, comment: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addComment",
          text: comment,
          userId: "user123", // This would come from authentication
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      // Create a new comment object
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        author: "You", // This would come from authentication
        timestamp: new Date().toISOString(),
      };

      // Update the posts state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/50 to-white/50" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your experiences, ask questions, and connect with others who
            are passionate about sustainable living.
          </p>
        </motion.div>

        {/* Filters and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "latest" | "popular")
                }
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus />
                Create Post
              </motion.button>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTags(
                    selectedTags.includes(tag)
                      ? selectedTags.filter((t) => t !== tag)
                      : [...selectedTags, tag]
                  );
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTags.includes(tag)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PostCard
                  post={post}
                  onLike={handleLikePost}
                  onComment={handleCommentPost}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default CommunityPage;
