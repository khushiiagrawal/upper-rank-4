"use client";

import { motion } from "framer-motion";
import {
  FaChrome,
  FaSearch,
  FaFilter,
  FaCog,
  FaLeaf,
  FaRecycle,
  FaSeedling,
} from "react-icons/fa";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const ExtensionPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage Guide" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Animation for floating icons
  const floatingIcons = [
    { icon: <FaLeaf />, delay: 0, duration: 15 },
    { icon: <FaRecycle />, delay: 3, duration: 20 },
    { icon: <FaSeedling />, delay: 6, duration: 18 },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-900/10 via-teal-900/50 to-green-900/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Add subtle animated patterns */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        {/* Animated floating blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating eco icons */}
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/30 text-4xl"
            initial={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              rotate: 0,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: item.duration,
              delay: item.delay,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="inline-block p-4 bg-emerald-100 rounded-2xl mb-6"
          >
            <FaChrome className="text-4xl text-emerald-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            R3Vision Browser Extension
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-2 max-w-3xl mx-auto drop-shadow-md"
          >
            Transform your online shopping experience with eco-friendly product
            discovery
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-4 pb-12 relative z-10">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* REST OF YOUR EXISTING CONTENT SECTIONS */}
          {activeTab === "overview" && (
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">
                  What is R3Vision?
                </h2>
                <p className="text-white/90 leading-relaxed">
                  R3Vision is a powerful Chrome extension designed to help you
                  discover eco-friendly products while shopping online. It
                  automatically enhances your search queries and filters results
                  to show only sustainable products across major e-commerce
                  platforms.
                </p>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10"
                >
                  <div className="text-emerald-400 mb-4">
                    <FaSearch className="text-3xl" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Smart Search</h3>
                  <p className="text-white/80 text-sm">
                    Automatically enhances your searches with eco-friendly terms
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10"
                >
                  <div className="text-emerald-400 mb-4">
                    <FaFilter className="text-3xl" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Smart Filtering</h3>
                  <p className="text-white/80 text-sm">
                    Shows only sustainable products in your search results
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10"
                >
                  <div className="text-emerald-400 mb-4">
                    <FaCog className="text-3xl" />
                  </div>
                  <h3 className="font-bold mb-2 text-white">Customizable</h3>
                  <p className="text-white/80 text-sm">
                    Personalize your eco-friendly shopping experience
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Features tab complete content */}
          {activeTab === "features" && (
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Key Features
                </h2>
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-emerald-400 mt-1">
                      <FaLeaf className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-white">
                        Automatic Search Enhancement
                      </h3>
                      <p className="text-white/80">
                        Automatically adds eco-friendly terms to your search
                        queries, helping you discover sustainable products
                        effortlessly.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-emerald-400 mt-1">
                      <FaFilter className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-white">
                        Smart Filtering System
                      </h3>
                      <p className="text-white/80">
                        Applies intelligent filters to search results,
                        prioritizing products with eco-friendly certifications
                        and sustainable materials.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-emerald-400 mt-1">
                      <FaSeedling className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-white">
                        Product Impact Analysis
                      </h3>
                      <p className="text-white/80">
                        Provides insights into the environmental impact of
                        products, helping you make more informed purchasing
                        decisions.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="text-emerald-400 mt-1">
                      <FaCog className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2 text-white">
                        Customizable Preferences
                      </h3>
                      <p className="text-white/80">
                        Tailor the extension to focus on aspects of
                        sustainability that matter most to you, such as
                        recyclability, carbon footprint, or ethical production.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Installation tab complete content */}
          {activeTab === "installation" && (
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Installation Guide
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      title: "Download the extension",
                      description:
                        "Download the R3Vision extension files from our official website.",
                    },
                    {
                      title: "Access extensions page",
                      description:
                        "Go to chrome://extensions/ in your Chrome browser.",
                    },
                    {
                      title: "Enable developer mode",
                      description:
                        "Toggle the 'Developer mode' switch in the top right corner.",
                    },
                    {
                      title: "Install the extension",
                      description:
                        "Click 'Load unpacked' and select the extension directory.",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold mb-2 text-white">
                          {step.title}
                        </h3>
                        <p className="text-white/80">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Usage Guide tab complete content */}
          {activeTab === "usage" && (
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Usage Guide
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      title: "Visit e-commerce sites",
                      description:
                        "Visit any supported e-commerce site (Amazon, Flipkart, Myntra,Meesho).",
                    },
                    {
                      title: "Enter your search",
                      description:
                        "Enter your search query (e.g., 'water bottle').",
                    },
                    {
                      title: "Activate the extension",
                      description:
                        "Click the extension icon and toggle the switch to ON.",
                    },
                    {
                      title: "View eco-friendly results",
                      description:
                        "The extension will automatically modify your search and filter results to show only eco-friendly products.",
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold mb-2 text-white">
                          {step.title}
                        </h3>
                        <p className="text-white/80">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Download button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center mt-12"
        >
          <motion.a
            href="#download"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors duration-200 shadow-lg flex items-center gap-2"
          >
            <FaChrome className="text-xl" />
            <span>Download the Extension</span>
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
};

export default ExtensionPage;
