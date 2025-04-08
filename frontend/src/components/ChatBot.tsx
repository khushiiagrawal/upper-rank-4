"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  FiUpload,
  FiSend,
  FiMic,
  FiX,
  FiImage,
  FiSearch,
  FiDownload,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import ReactMarkdown from "react-markdown";

interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  image?: string;
  category?: "question" | "answer" | "suggestion";
  quickReplies?: string[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePrompt, setImagePrompt] = useState("");
  const [showImagePrompt, setShowImagePrompt] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Simulate upload progress
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  const formatMessage = (content: string) => {
    // Replace markdown-style formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br />");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      type: "user",
      content: input,
      timestamp: new Date(),
      category: "question",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Simulate typing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      setIsTyping(false);

      // Generate quick replies based on the response
      const quickReplies = generateQuickReplies(data.response);

      const botMessage: Message = {
        type: "bot",
        content: data.response,
        timestamp: new Date(),
        category: "answer",
        quickReplies,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const generateQuickReplies = (response: string): string[] => {
    // Simple logic to generate quick replies based on the response
    const quickReplies: string[] = [];

    if (response.toLowerCase().includes("recycle")) {
      quickReplies.push("How can I recycle this?");
      quickReplies.push("Where are recycling centers near me?");
    }

    if (response.toLowerCase().includes("reuse")) {
      quickReplies.push("How can I reuse this item?");
      quickReplies.push("What are creative reuse ideas?");
    }

    if (response.toLowerCase().includes("reduce")) {
      quickReplies.push("How can I reduce waste?");
      quickReplies.push("What are eco-friendly alternatives?");
    }

    // Add some generic questions if we don't have enough
    if (quickReplies.length < 2) {
      quickReplies.push("Tell me more about sustainability");
      quickReplies.push("What are other eco-friendly options?");
    }

    return quickReplies.slice(0, 3); // Limit to 3 quick replies
  };

  const handleQuickReply = (reply: string) => {
    setInput(reply);
    // Automatically send the quick reply
    setTimeout(() => {
      setInput(reply);
      handleSend();
    }, 100);
  };

  const handleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser does not support speech recognition");
      return;
    }

    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
      setInput(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      setIsRecording(true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      setShowImagePrompt(true);
    };
    reader.readAsDataURL(file);
  };

  const handleImagePromptSubmit = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setUploadProgress(0);
    setShowImagePrompt(false);

    // Add user message with image preview
    const userMessage: Message = {
      type: "user",
      content: imagePrompt || "Analyzing this image...",
      timestamp: new Date(),
      image: selectedImage,
      category: "question",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt || "What do you see in this image?",
          image: selectedImage,
        }),
      });

      const data = await response.json();
      setUploadProgress(100);
      setIsTyping(false);

      // Generate quick replies based on the response
      const quickReplies = generateQuickReplies(data.response);

      const botMessage: Message = {
        type: "bot",
        content: data.response,
        timestamp: new Date(),
        category: "answer",
        quickReplies,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsTyping(false);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setSelectedImage(null);
      setImagePrompt("");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const exportChat = () => {
    // Create a text representation of the chat
    let chatText = "Chat with EcoBot\n\n";

    messages.forEach((msg) => {
      const time = msg.timestamp.toLocaleTimeString();
      const sender = msg.type === "user" ? "You" : "EcoBot";
      chatText += `[${time}] ${sender}: ${msg.content}\n\n`;
    });

    // Create a blob and download link
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-with-ecobot.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMessages = showSearch
    ? messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <div className="relative">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg flex items-center justify-center text-2xl hover:shadow-xl transition-all animate-pulse-green relative z-20"
          style={{
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            transform: "translateZ(0)",
          }}
        >
          {isOpen ? "💬" : "💬"}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
            } rounded-lg shadow-2xl w-96 h-[600px] overflow-hidden border ${
              darkMode ? "border-gray-700" : "border-green-100"
            } transform perspective-1000 absolute bottom-20 right-0`}
            style={{
              boxShadow:
                "0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2)",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 bg-gradient-to-r from-green-600 to-green-500 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <span className="text-lg">🌱</span>
                  </div>
                  <h2 className="text-xl font-bold">EcoBot</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-1 hover:bg-green-700 rounded-full transition-colors"
                    title="Search messages"
                  >
                    <FiSearch size={18} />
                  </button>
                  <button
                    onClick={exportChat}
                    className="p-1 hover:bg-green-700 rounded-full transition-colors"
                    title="Export chat"
                  >
                    <FiDownload size={18} />
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-1 hover:bg-green-700 rounded-full transition-colors"
                    title={darkMode ? "Light mode" : "Dark mode"}
                  >
                    {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-green-700 rounded-full transition-colors"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>
              </div>

              {showSearch && (
                <div
                  className={`p-2 border-b ${
                    darkMode ? "border-gray-700" : "border-green-100"
                  }`}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className={`w-full p-2 border ${
                      darkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-green-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      darkMode
                        ? "text-gray-100 placeholder-gray-400"
                        : "text-black placeholder-gray-500"
                    }`}
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 self-end mb-1">
                        <span className="text-sm">🌱</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? darkMode
                            ? "bg-green-600 text-white"
                            : "bg-green-600 text-white"
                          : darkMode
                          ? "bg-gray-800 text-gray-100"
                          : "bg-gray-100 text-gray-800"
                      } ${
                        message.category === "question"
                          ? "border-l-4 border-blue-500"
                          : message.category === "answer"
                          ? "border-l-4 border-green-500"
                          : message.category === "suggestion"
                          ? "border-l-4 border-yellow-500"
                          : ""
                      }`}
                      style={{
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        transform: "translateZ(0)",
                      }}
                    >
                      {message.image && (
                        <div className="mb-2 rounded-md overflow-hidden">
                          <img
                            src={message.image}
                            alt="Uploaded"
                            className="max-w-full h-auto max-h-40 object-cover"
                          />
                        </div>
                      )}
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(message.content),
                        }}
                      />
                      <div className="text-xs opacity-70 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 self-end mb-1">
                        <span className="text-sm">👤</span>
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2 self-end mb-1">
                      <span className="text-sm">🌱</span>
                    </div>
                    <div
                      className={`bg-${
                        darkMode ? "gray-800" : "gray-100"
                      } rounded-lg p-3 flex items-center space-x-1`}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className={`w-2 h-2 bg-${
                          darkMode ? "gray-500" : "gray-400"
                        } rounded-full`}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.2,
                        }}
                        className={`w-2 h-2 bg-${
                          darkMode ? "gray-500" : "gray-400"
                        } rounded-full`}
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.4,
                        }}
                        className={`w-2 h-2 bg-${
                          darkMode ? "gray-500" : "gray-400"
                        } rounded-full`}
                      />
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {(() => {
                const lastMessage =
                  messages.length > 0 ? messages[messages.length - 1] : null;
                const hasQuickReplies =
                  lastMessage?.type === "bot" &&
                  lastMessage?.quickReplies &&
                  lastMessage?.quickReplies.length > 0;

                return hasQuickReplies ? (
                  <div className="px-4 py-2 border-t border-green-100">
                    <div className="flex flex-wrap gap-2">
                      {lastMessage!.quickReplies!.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              <div
                className={`p-4 border-t ${
                  darkMode ? "border-gray-700" : "border-green-100"
                }`}
              >
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className={`flex-1 p-2 border ${
                      darkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-green-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      darkMode
                        ? "text-gray-100 placeholder-gray-400"
                        : "text-black placeholder-gray-500"
                    }`}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    title="Upload image"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiUpload size={20} />
                    )}
                  </button>
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-lg ${
                      isRecording
                        ? darkMode
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600"
                        : darkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    title="Voice input"
                  >
                    <FiMic size={20} />
                  </button>
                  <button
                    onClick={handleSend}
                    className={`p-2 rounded-lg ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    title="Send message"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div
                      className={`w-full bg-${
                        darkMode ? "gray-700" : "gray-200"
                      } rounded-full h-1.5`}
                    >
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } mt-1`}
                    >
                      Uploading image... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 bg-white p-3 rounded-lg shadow-lg border border-green-100 max-w-xs"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              transform: "translateZ(0)",
            }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <span className="text-lg">🌱</span>
              </div>
              <p className="text-sm text-gray-700">
                Hi! I'm <span className="font-bold text-green-600">EcoBot</span>
                , your AI assistant. How can I help you today?
              </p>
            </div>
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-3 h-3 bg-white border-r border-b border-green-100"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Prompt Modal */}
      <AnimatePresence>
        {showImagePrompt && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Add a prompt for your image
              </h3>
              <div className="mb-4 rounded-md overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto max-h-48 object-cover"
                />
              </div>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="What would you like to know about this image? (Optional)"
                className="w-full p-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black placeholder-gray-500 mb-4"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowImagePrompt(false);
                    setSelectedImage(null);
                    setImagePrompt("");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImagePromptSubmit}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
