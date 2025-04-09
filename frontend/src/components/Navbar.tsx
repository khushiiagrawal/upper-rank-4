"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaInfoCircle,
  FaQuestionCircle,
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import UnauthorizedDialog from "./UnauthorizedDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUnauthorizedDialog, setShowUnauthorizedDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isCommunityPage = pathname === "/community";
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links - same for all pages
  const navLinks = [
    { name: "Home", href: "/", icon: <FaHome /> },
    { name: "About", href: "/#about", icon: <FaInfoCircle /> },
    {
      name: "How to Use",
      href: "/#how-to-use",
      icon: <FaQuestionCircle />,
    },
    { name: "Community", href: "/#community", icon: <FaUsers /> }, // Changed from /community to /#community
    { name: "Contact", href: "/#contact", icon: <FaEnvelope /> },
  ];

  // Handle anchor links when on non-home pages
  const handleAnchorLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/#") && pathname !== "/") {
      e.preventDefault();
      window.location.href = href; // Navigate to home page with the anchor
    }
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
    setShowUnauthorizedDialog(false);
  };

  const handleOpenSignup = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
    setShowUnauthorizedDialog(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 
          ${
            scrolled
              ? "bg-green-100 backdrop-blur-md shadow-md"
              : "bg-transparent"
          } 
          ${isCommunityPage ? "bg-green-100 backdrop-blur-md shadow-md" : ""}`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img src="/logo.png" alt="Logo" className="h-20 mt-3 w-auto" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleAnchorLink(e, link.href)}
                  className={`flex items-center gap-2 text-base md:text-lg transition-all duration-300
                  ${
                    scrolled || isCommunityPage
                      ? "text-gray-700 hover:text-emerald-600"
                      : "text-white/90 hover:text-white"
                  }
                  hover:scale-105 active:scale-95 relative group`}
                >
                  <span className="text-base transition-transform duration-300 group-hover:scale-110">
                    {link.icon}
                  </span>
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300
                    ${
                      scrolled || isCommunityPage
                        ? "bg-emerald-500"
                        : "bg-white"
                    }
                    group-hover:w-full`}
                  />
                </Link>
              ))}

              {/* User Authentication */}
              {loading ? (
                // Loading state
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
              ) : user ? (
                // User is logged in
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                      ${
                        scrolled || isCommunityPage
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white/10 text-white backdrop-blur-sm border border-white/30 hover:bg-white/20"
                      }
                    `}
                  >
                    <FaUserCircle className="text-base" />
                    {user.name}
                  </motion.button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2"
                      >
                        <FaSignOutAlt />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // User is not logged in
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenLogin}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors
                      ${
                        scrolled || isCommunityPage
                          ? "text-emerald-600 hover:text-emerald-700"
                          : "text-white hover:text-white/80"
                      }
                    `}
                  >
                    Login
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpenSignup}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                      ${
                        scrolled || isCommunityPage
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-white/10 text-white backdrop-blur-sm border border-white/30 hover:bg-white/20"
                      }
                    `}
                  >
                    <FaUserCircle className="text-base" />
                    Sign Up
                  </motion.button>
                </div>
              )}
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors duration-300
                  ${
                    isOpen
                      ? "bg-emerald-50 text-emerald-600"
                      : scrolled || isCommunityPage
                      ? "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                      : "text-white hover:bg-white/10"
                  }
                `}
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden
            ${
              scrolled
                ? "bg-white/90 backdrop-blur-md"
                : "bg-white/90 backdrop-blur-md"
            }
            border-t border-gray-100
          `}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleAnchorLink(e, link.href);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium 
                  transition-all duration-300
                  ${
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }
                  hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                <span className="text-base">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            {/* Mobile Authentication */}
            {loading ? (
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
              </div>
            ) : user ? (
              <>
                <div className="px-4 py-2.5 text-base font-medium text-emerald-600 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaUserCircle />
                    <span>{user.name}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium
                    text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <FaSignOutAlt />
                  Sign out
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleOpenLogin();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium
                    text-emerald-600 hover:bg-emerald-50 transition-all duration-300"
                >
                  <FaUserCircle />
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleOpenSignup();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-base font-medium
                    bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300"
                >
                  <FaUserCircle />
                  Sign Up
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.nav>

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
    </>
  );
};

export default Navbar;
