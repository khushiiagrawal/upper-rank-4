"use client";

import { motion } from "framer-motion";
import { FaUsers, FaLightbulb, FaHandshake, FaComments } from "react-icons/fa";

const CommunitySection = () => {
  const features = [
    {
      icon: <FaUsers className="text-4xl text-green-400" />,
      title: "Join Our Community",
      description:
        "Connect with like-minded individuals passionate about sustainable waste management.",
    },
    {
      icon: <FaLightbulb className="text-4xl text-green-400" />,
      title: "Share Ideas",
      description:
        "Exchange innovative ideas and solutions for better waste management practices.",
    },
    {
      icon: <FaHandshake className="text-4xl text-green-400" />,
      title: "Collaborate",
      description:
        "Work together on community initiatives and environmental projects.",
    },
    {
      icon: <FaComments className="text-4xl text-green-400" />,
      title: "Discuss",
      description:
        "Engage in meaningful discussions about sustainability and waste reduction.",
    },
  ];

  return (
    <section id="community" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-green-600 mb-4">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Be part of a growing community dedicated to making a difference in
            waste management and sustainability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Join Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
