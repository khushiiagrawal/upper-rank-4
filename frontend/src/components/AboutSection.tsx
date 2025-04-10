"use client";

import { motion } from "framer-motion";
import {
  FaRecycle,
  FaExchangeAlt,
  FaShoppingCart,
  FaLeaf,
  FaTree,
  FaWater,
} from "react-icons/fa";
import { useState, useEffect } from "react";

// Seeded random number generator for consistent values
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const AboutSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [showLeafAnimation, setShowLeafAnimation] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <FaRecycle className="text-4xl text-green-500" />,
      title: "Recycle",
      description: "Identify recyclable materials and learn how to properly recycle them.",
    },
    {
      icon: <FaExchangeAlt className="text-4xl text-green-500" />,
      title: "Reuse",
      description: "Discover creative ways to repurpose items instead of discarding them.",
    },
    {
      icon: <FaShoppingCart className="text-4xl text-green-500" />,
      title: "Resale",
      description: "Find platforms to sell or donate items that still have value.",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev < 2 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setShowLeafAnimation(true);
      setTimeout(() => setShowLeafAnimation(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <section id="about" className="pt-16 pb-12 relative overflow-hidden bg-white">
      {/* Animated leaf elements */}
      {mounted && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8 text-green-400 opacity-20"
              initial={{
                top: `${seededRandom(i * 3) * 100}%`,
                left: `${seededRandom(i * 3 + 1) * 100}%`,
                rotate: seededRandom(i * 3 + 2) * 360,
              }}
              animate={{
                top: `${seededRandom(i * 3 + 8) * 100}%`,
                left: `${seededRandom(i * 3 + 9) * 100}%`,
                rotate: seededRandom(i * 3 + 10) * 360,
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 15 + seededRandom(i) * 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8 S16.4,20,12,20z M12,6c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,6,12,6z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4 S14.2,16,12,16z" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Environmental impact indicators */}
      <div className="absolute top-10 right-10 flex flex-col space-y-4 opacity-70">
        {[
          { icon: FaTree, width: "85%" },
          { icon: FaWater, width: "92%" },
          { icon: FaRecycle, width: "78%" },
        ].map(({ icon: Icon, width }, idx) => (
          <motion.div
            key={idx}
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
          >
            <Icon className="text-green-500 text-xl" />
            <div className="h-2 w-24 bg-green-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width }}
                transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.h2
            className="section-title text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-xl max-w-3xl mx-auto text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our mission is to redefine waste management by leveraging AI-driven intelligence to promote the 3Rs – Reuse, Recycle and Resale.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className={`card relative overflow-hidden border border-white-1 ${
                activeFeature === index ? "ring-2 ring-green-500" : ""
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-green-100">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: activeFeature >= index ? "100%" : "0%" }}
                  transition={{ duration: 1, delay: index * 0.5 }}
                />
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <motion.div
                  className={`mb-4 p-4 rounded-full ${
                    activeFeature >= index ? "bg-green-100" : "bg-white"
                  }`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                >
                  {feature.icon}
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  className="text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                >
                  {feature.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
