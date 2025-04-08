"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
  FaInfoCircle,
  FaQuestionCircle,
  FaEnvelope,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isCommunityPage = pathname === "/community";

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

  const navLinks = isCommunityPage
    ? [{ name: "Home", href: "/", icon: <FaHome /> }]
    : [
        { name: "Home", href: "/", icon: <FaHome /> },
        { name: "About", href: "/#about", icon: <FaInfoCircle /> },
        {
          name: "How to Use",
          href: "/#how-to-use",
          icon: <FaQuestionCircle />,
        },
        { name: "Community", href: "/community", icon: <FaUsers /> },
        { name: "Contact", href: "/#contact", icon: <FaEnvelope /> },
      ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <span className="text-2xl font-bold text-green-600">3R</span>
              <span className="text-2xl font-bold text-gray-800">Vision</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-green-600"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                <span className="text-xs">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
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
        className={`md:hidden overflow-hidden ${
          scrolled ? "bg-white" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "bg-green-100 text-green-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
