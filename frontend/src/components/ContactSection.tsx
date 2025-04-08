"use client";

import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

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
                {/* Social media icons would go here */}
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
