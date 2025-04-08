"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const navItems = [
    { name: "Home", id: "hero" },
    { name: "About Us", id: "about" },
    { name: "How to Use", id: "how-to-use" },
    { name: "Contact Us", id: "contact" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold text-green-600">
              3RVision
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-4 py-2 text-green-300 font-medium overflow-hidden rounded-md transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-green-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-green-300 hover:text-green-400 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? "auto" : 0,
          opacity: mobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-green-900/90 backdrop-blur-md"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left px-3 py-2 text-green-300 hover:text-green-400 hover:bg-green-800/50 rounded-md text-base font-medium transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
