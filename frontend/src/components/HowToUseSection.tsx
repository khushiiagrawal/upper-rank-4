"use client";

import { motion } from "framer-motion";
import {
  FaCamera,
  FaUpload,
  FaSearch,
  FaLeaf,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

// Seeded RNG for visual consistency
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const generatePositions = (seed: number) => ({
  x: seededRandom(seed) * 100,
  y: seededRandom(seed + 1) * 100,
  scale: 0.8 + seededRandom(seed + 2) * 0.4,
});

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < 2 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: <FaCamera className="w-8 h-8" />,
      title: "Take a Photo",
      description: "Capture an image of your waste or upload a photo.",
    },
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Get AI Analysis",
      description: "AI analyzes waste and shows recyclability info.",
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Follow Recommendations",
      description: "Receive suggestions on how to manage your waste.",
    },
  ];

  const handleScanImage = async () => {
    try {
      if (showCamera) {
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
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
          }
        }
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setCameraStream(stream);
        setShowCamera(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied. Please grant permissions.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCapturedImage(imageData);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) return null;

  return (
    <section
      ref={sectionRef}
      className="py-12 bg-gradient-to-b from-green-50 to-white relative overflow-hidden"
      id="how-to-use"
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3].map((seed) => {
          const pos = generatePositions(seed);
          return (
            <motion.div
              key={seed}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isVisible
                  ? {
                      opacity: 0.1,
                      scale: pos.scale,
                      x: `${pos.x}%`,
                      y: `${pos.y}%`,
                    }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 1.5, delay: 0.2 * seed }}
              className={`absolute w-64 h-64 rounded-full filter blur-3xl ${
                seed === 1
                  ? "bg-green-300"
                  : seed === 2
                  ? "bg-blue-300"
                  : "bg-yellow-300"
              }`}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How to Use 3RVision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes waste management simple and effective. Follow
            these steps to get started.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Camera & Upload Actions */}
        <div className="mt-12 text-center space-x-4">
          <button
            onClick={handleScanImage}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
          >
            {showCamera ? "Capture Photo" : "Open Camera"}
          </button>
          <button
            onClick={handleUploadImage}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {showCamera && (
          <div className="mt-6 flex justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg w-full max-w-md border"
            />
          </div>
        )}

        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-green-600 text-center font-semibold"
          >
            Image received successfully!
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HowToUseSection;
