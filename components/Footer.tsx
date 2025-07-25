"use client";

import React, { JSX, useEffect, useState } from "react";

import { ArrowUp } from "lucide-react"; // Optional icon library
import { motion } from "framer-motion";

const Footer = (): JSX.Element => {
  const [showButton, setShowButton] = useState(false);

  // Show button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-full shadow-lg transition-all duration-300"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      <section className="bg-neutral-900 text-white py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <h1 className="text-lg font-medium">
            Made with <span className="text-red-500">❤️</span> by{" "}
            <span className="font-semibold text-blue-400">
              Priyanshu Mandloi
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default Footer;
