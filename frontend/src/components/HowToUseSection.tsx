"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaCamera,
  FaUpload,
  FaChrome,
  FaCheck,
  FaArrowRight,
  FaSearch,
  FaLeaf,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

// Seeded random number generator for consistent values between server and client
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate consistent positions based on a seed
const generatePositions = (seed: number) => {
  return {
    x: seededRandom(seed) * 100,
    y: seededRandom(seed + 1) * 100,
    scale: 0.8 + seededRandom(seed + 2) * 0.4,
  };
};

const HowToUseSection = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run client-side code after component has mounted
  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const steps = [
    {
      icon: <FaCamera className="w-8 h-8" />,
      title: "Take a Photo",
      description:
        "Capture an image of your waste using your device's camera or upload an existing photo.",
    },
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Get AI Analysis",
      description:
        "Our AI will analyze your waste and provide detailed information about its composition and recyclability.",
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Follow Recommendations",
      description:
        "Receive personalized recommendations on how to properly dispose of or recycle your waste.",
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

  // Only render animated elements after component has mounted
  if (!mounted) {
    return (
      <section
        ref={sectionRef}
        className="py-12 bg-gradient-to-b from-green-50 to-white relative overflow-hidden"
        id="how-to-use"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How to Use 3RVision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes waste management simple and effective. Follow
              these steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-12 relative overflow-hidden bg-transparent"
      id="how-to-use"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            How to Use 3RVision
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Our platform makes waste management simple and effective. Follow
            these steps to get started.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="bg-white/20 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-white/10"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isVisible ? { scale: 1 } : { scale: 0.8 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.2,
                  type: "spring",
                }}
                className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6 text-white"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-white/80">{step.description}</p>
            </motion.div>
          ))}
        </div>
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
