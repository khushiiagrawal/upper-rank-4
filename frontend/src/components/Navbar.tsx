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
      className={`fixed w-full z-50 transition-all duration-300 
        ${
          scrolled ? "bg-green-50 backdrop-blur-md shadow-md" : "bg-transparent"
        } 
        ${isCommunityPage ? "bg-green-50 backdrop-blur-md shadow-md" : ""}`}
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
                className={`flex items-center gap-2 text-base text-lg transition-all duration-300
                  ${
                    pathname === link.href
                      ? scrolled || isCommunityPage
                        ? "text-emerald-600 scale-105"
                        : "text-white scale-105"
                      : scrolled || isCommunityPage
                      ? "text-gray-700 hover:text-emerald-600"
                      : "text-white/90 hover:text-white"
                  }
                  hover:scale-105 active:scale-95
                  relative group
                `}
              >
                <span className="text-base transition-transform duration-300 group-hover:scale-110">
                  {link.icon}
                </span>
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300
                  ${
                    pathname === link.href
                      ? scrolled || isCommunityPage
                        ? "bg-emerald-500"
                        : "bg-white"
                      : scrolled || isCommunityPage
                      ? "bg-emerald-500"
                      : "bg-white"
                  }
                  ${pathname === link.href ? "w-full" : "group-hover:w-full"}`}
                />
              </Link>
            ))}
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
              onClick={() => setIsOpen(false)}
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
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
