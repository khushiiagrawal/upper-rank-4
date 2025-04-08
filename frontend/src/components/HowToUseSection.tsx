"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaCamera,
  FaUpload,
  FaChrome,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

const HowToUseSection = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      icon: <FaCamera className="text-4xl text-green-500" />,
      title: "Scan or Upload",
      description:
        "Take a photo of your item or upload an existing image from your device.",
    },
    {
      icon: <FaUpload className="text-4xl text-green-500" />,
      title: "Get Recommendations",
      description:
        "Our AI analyzes your item and provides personalized recommendations for reuse, recycling, or resale options.",
    },
    {
      icon: <FaChrome className="text-4xl text-green-500" />,
      title: "Take Action",
      description:
        "Follow the suggested steps to responsibly dispose of your item or find a new home for it.",
    },
  ];

  // Auto-advance active step for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 2 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleScanImage = async () => {
    try {
      if (showCamera) {
        // If camera is already showing, capture the image
        if (videoRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const imageData = canvas.toDataURL("image/jpeg");
            setCapturedImage(imageData);
            setShowCamera(false);
            stopCamera();
            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
            // Here you would typically send the image to your backend for processing
            console.log("Image captured:", imageData);
          }
        }
      } else {
        // Start the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setCameraStream(stream);
        setShowCamera(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Unable to access camera. Please make sure you have granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        // Show success message
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        // Here you would typically send the image to your backend for processing
        console.log("Image uploaded:", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section
      id="how-to-use"
      ref={sectionRef}
      className="py-20 bg-green-50 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "18s" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-green-300/20 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "14s", animationDelay: "3s" }}
        ></div>

        {/* Animated particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.3 + Math.random() * 0.7,
            }}
            animate={{
              y: [null, Math.random() * 100 + "%"],
              opacity: [null, 0.3 + Math.random() * 0.7],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How to Use 3RVision
          </motion.h2>
          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our platform makes it easy to make sustainable choices for your
            items. Follow these simple steps to get started.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              variants={fadeInUp}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.3 },
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              className={`card bg-white relative overflow-hidden ${
                activeStep === index ? "ring-2 ring-green-500" : ""
              }`}
            >
              {/* Progress indicator */}
              <div className="absolute top-0 left-0 w-full h-1 bg-green-100">
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: activeStep >= index ? "100%" : "0%" }}
                  transition={{ duration: 1, delay: index * 0.5 }}
                />
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <motion.div
                  className={`mb-4 p-4 rounded-full ${
                    activeStep >= index ? "bg-green-100" : "bg-green-50"
                  }`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                >
                  {step.icon}
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold text-gray-800 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  className="text-gray-700"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                >
                  {step.description}
                </motion.p>

                {activeStep === index && (
                  <motion.div
                    className="mt-4 text-green-500 flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="mr-1">Current step</span>
                    <FaArrowRight className="animate-pulse" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.6 }}
          variants={fadeInUp}
          className="mt-16 text-center"
        >
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScanImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <FaCamera className="text-xl" />
              <span>{showCamera ? "Capture Image" : "Scan Image"}</span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <FaUpload className="text-xl" />
              <span>Upload Image</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Camera view */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-2xl"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
              />
              <div className="mt-4 flex space-x-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCamera(false);
                    stopCamera();
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleScanImage}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
                >
                  Capture
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captured/Uploaded image preview */}
      <AnimatePresence>
        {capturedImage && !showCamera && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full max-w-2xl"
            >
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
              />
              <div className="mt-4 flex space-x-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCapturedImage(null)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-lg"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
                >
                  Analyze
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <FaCheck className="text-xl" />
            <span>Image successfully captured!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </section>
  );
};

export default HowToUseSection;
