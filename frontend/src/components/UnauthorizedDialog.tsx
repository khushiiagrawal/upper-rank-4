"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock, FaLeaf } from "react-icons/fa";
import Link from "next/link";

interface UnauthorizedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const UnauthorizedDialog = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
}: UnauthorizedDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100"
          >
            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <FaLock className="text-emerald-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Join Our Eco Community
                </h2>
                <p className="text-gray-600">
                  Please log in or sign up to access our community features and
                  connect with like-minded eco-enthusiasts.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <FaLeaf className="text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm">
                    By joining our community, you'll be able to share ideas,
                    participate in discussions, and collaborate on sustainable
                    initiatives with others who are passionate about protecting
                    our planet.
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                  className="flex-1 py-3 px-4 bg-white border border-emerald-600 text-emerald-600 font-medium rounded-lg transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Log In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSignup}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Sign Up
                </motion.button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Want to explore first?{" "}
                  <Link
                    href="/"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Return to homepage
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnauthorizedDialog;
