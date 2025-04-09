"use client";

import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: false,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus({ loading: true, success: false, error: false, message: "" });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Success! Clear the form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setStatus({
        loading: false,
        success: true,
        error: false,
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false, message: "" }));
      }, 5000);
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        loading: false,
        success: false,
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl text-green-500" />,
      title: "Email",
      details: "info@3rvision.com",
      link: "mailto:info@3rvision.com",
    },
    {
      icon: <FaPhone className="text-2xl text-green-500" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-green-500" />,
      title: "Location",
      details: "123 Green Street, Eco City, EC 12345",
      link: "https://maps.google.com",
    },
  ];

  return (
    <section id="contact" className="py-12 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-1/4 h-1/4 bg-green-100/20 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-green-200/20 rounded-full blur-3xl animate-float"
          style={{ animationDuration: "16s", animationDelay: "1s" }}
        ></div>
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
          <h2 className="section-title">Contact Us</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="card bg-green-50"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Send us a message
            </h3>

            {/* Status messages */}
            {status.success && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
                <FaCheckCircle className="mr-2" />
                {status.message}
              </div>
            )}

            {status.error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                <FaExclamationCircle className="mr-2" />
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={status.loading}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={status.loading}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={status.loading}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black "
                  required
                  disabled={status.loading}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`btn-primary w-full flex items-center justify-center ${
                  status.loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={status.loading}
              >
                {status.loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Rest of the component remains unchanged */}
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Get in touch
            </h3>

            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target={item.title === "Location" ? "_blank" : undefined}
                rel={
                  item.title === "Location" ? "noopener noreferrer" : undefined
                }
                className="flex items-start p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="mr-4 p-3 bg-white rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: 0 }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {item.title}
                  </h4>
                  <p className="text-gray-700">{item.details}</p>
                </div>
              </motion.a>
            ))}

            {/* Social media section remains unchanged */}
            <motion.div
              className="mt-8 p-6 bg-green-50 rounded-lg"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Follow us
              </h4>
              <p className="text-gray-700 mb-4">
                Stay updated with our latest news and updates on sustainable
                waste management.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons */}
                <motion.div
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  FB
                </motion.div>
                <motion.div
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  TW
                </motion.div>
                <motion.div
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  IG
                </motion.div>
                <motion.div
                  className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  LI
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
