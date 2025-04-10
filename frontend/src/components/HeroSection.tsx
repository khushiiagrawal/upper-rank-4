"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Earth3D from "./Earth3D";
import { FaCamera, FaUpload, FaChrome } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UnauthorizedDialog from "./UnauthorizedDialog";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

const HeroSection = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // State for tracking uploads and showing auth modals
  const [remainingUploads, setRemainingUploads] = useState(3);
  const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Load remaining uploads from localStorage on component mount
  useEffect(() => {
    if (!user) {
      const storedUploads = localStorage.getItem("remainingUploads");
      if (storedUploads !== null) {
        setRemainingUploads(parseInt(storedUploads));
      } else {
        localStorage.setItem("remainingUploads", "3");
      }
    } else {
      // If user is logged in, ensure they have unlimited uploads
      localStorage.removeItem("remainingUploads");
    }
  }, [user]);

  // Update localStorage when remaining uploads changes
  useEffect(() => {
    if (!user && remainingUploads >= 0) {
      localStorage.setItem("remainingUploads", remainingUploads.toString());
    }
  }, [remainingUploads, user]);

  // Check if user can upload
  const canUpload = () => {
    if (user) return true; // Logged in users have unlimited uploads
    return remainingUploads > 0;
  };

  // Decrement upload count after successful upload/scan
  const decrementUploads = () => {
    if (!user && remainingUploads > 0) {
      setRemainingUploads((prev) => prev - 1);
    }
  };

  const handleScanImage = async () => {
    // Check if user can upload
    if (!canUpload()) {
      setShowUnauthorizedDialog(true);
      return;
    }

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
            // Decrement uploads after successful capture
            decrementUploads();
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
    // Check if user can upload
    if (!canUpload()) {
      setShowUnauthorizedDialog(true);
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:8080/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setCapturedImage(data.url);
        // Decrement uploads after successful upload
        decrementUploads();
        console.log("Image uploaded successfully:", data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleChromeExtension = () => {
    // Implement Chrome extension link
    window.open("https://chrome.google.com/webstore", "_blank");
  };

  return (
    <div
      id="hero"
      className="relative h-screen w-full bg-gradient-to-b from-green-900/10 via-teal-900/70 to-green-900/40 overflow-hidden pt-16"
    >
      {/* Background elements */}
      <div className="absolute mt-16 inset-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Earth3D scale={1.3} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            rotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Camera view */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="max-w-full max-h-[70vh] rounded-lg"
          />
          <div className="mt-4 flex space-x-4">
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
        </div>
      )}

      {/* Captured/Uploaded image preview */}
      {capturedImage && !showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-90">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-[70vh] rounded-lg"
          />
          <div className="mt-4 flex space-x-4">
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
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-2"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Redefining Waste Management
          </h1>

          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Empowering sustainable choices through AI-driven intelligence for
            Reuse, Recycle, and Resale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          {/* Buttons row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScanImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
            >
              <FaCamera className="text-xl" />
              <span>{showCamera ? "Capture Image" : "Scan Image"}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUploadImage}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
            >
              <FaUpload className="text-xl" />
              <span>Upload Image</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChromeExtension}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg"
            >
              <FaChrome className="text-xl" />
              <span>Chrome Extension</span>
            </motion.button>
          </div>

          {/* Display remaining uploads message AFTER the buttons */}
          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-white/20 backdrop-blur-md rounded-lg p-2 mt-2 text-white max-w-md"
            >
              <p>
                You have {remainingUploads} free uploads remaining. <br />
                Sign up or log in for unlimited access.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false);
          setShowSignupModal(true);
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
        }}
      />

      {/* Unauthorized Access Dialog */}
      <UnauthorizedDialog
        isOpen={showUnauthorizedDialog}
        onClose={() => setShowUnauthorizedDialog(false)}
        onLogin={() => {
          setShowUnauthorizedDialog(false);
          setShowLoginModal(true);
        }}
        onSignup={() => {
          setShowUnauthorizedDialog(false);
          setShowSignupModal(true);
        }}
      />
    </div>
  );
};

export default HeroSection;
