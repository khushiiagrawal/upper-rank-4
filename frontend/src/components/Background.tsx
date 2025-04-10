"use client";

import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaSeedling } from "react-icons/fa";

const AnimatedBackground = ({ includeIcons = true }) => {
  // Increased number of floating icons
  const floatingIcons = [
    { icon: <FaLeaf />, delay: 0, duration: 15, size: "text-4xl" },
    { icon: <FaRecycle />, delay: 3, duration: 20, size: "text-4xl" },
    { icon: <FaLeaf />, delay: 5, duration: 18, size: "text-3xl" },
    { icon: <FaRecycle />, delay: 8, duration: 17, size: "text-5xl" },
    { icon: <FaSeedling />, delay: 2, duration: 22, size: "text-4xl" },
    { icon: <FaLeaf />, delay: 6, duration: 19, size: "text-2xl" },
    { icon: <FaRecycle />, delay: 10, duration: 21, size: "text-3xl" },
  ];

  // Position patterns to distribute icons evenly
  const positions = [
    { top: "20%", left: "15%" },
    { top: "70%", left: "80%" },
    { top: "30%", left: "75%" },
    { top: "80%", left: "25%" },
    { top: "50%", left: "50%" },
    { top: "15%", left: "55%" },
    { top: "65%", left: "10%" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Add subtle animated patterns */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Animated floating blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Multiple floating eco icons with varied positions and animations */}
      {includeIcons &&
        floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute text-green-500/30 ${item.size}`}
            initial={{
              top: positions[i].top,
              left: positions[i].left,
              rotate: 0,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: i % 2 === 0 ? 360 : -360,
              opacity: [0.3, 0.5, 0.3],
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
  );
};

export default AnimatedBackground;
