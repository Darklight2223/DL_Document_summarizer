
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
  


const About = () => {
  const { auth } = useAuth();
  return (
    <div className="min-h-screen w-full bg-gray-950 text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
        >
          About DL-Scanner
        </motion.h1>

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto"
        >
          DL-Scanner is your intelligent document assistant built for the modern world. With the rise of digital paperwork, research overload, and information fatigue, we aim to simplify how people interact with documents — scan, extract, summarize, and organize — all in one place.
        </motion.p>

        {/* Sections */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">📘 Our Story</h2>
            <p className="text-gray-300">
              DL-Scanner began with a simple question: "Why is document work still so time-consuming in the AI era?" From classrooms to courtrooms, we saw a need for fast, accurate, and user-friendly tools that reduce friction in reading, processing, and understanding documents. Our journey started with handwritten notes and grew into a robust solution for everyone.
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">🌟 What Makes Us Unique</h2>
            <p className="text-gray-300">
              Unlike traditional scanners or OCR tools, DL-Scanner doesn’t stop at text extraction. We give your content meaning. Summarization, semantic grouping, smart previews — all designed to help you absorb and act on information faster. We care about clarity, speed, and elegant experience.
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">🌐 Who We Serve</h2>
            <p className="text-gray-300">
              Students summarizing lecture notes. Lawyers reviewing dense contracts. Researchers condensing dozens of PDFs. DL-Scanner is built for anyone who deals with complex, text-heavy content and needs clarity instantly. Whether you’re a solo user or part of a large team — we scale with your needs.
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">📈 Our Vision</h2>
            <p className="text-gray-300">
              We believe in a future where interacting with documents is as seamless as chatting with a friend. No more walls of unreadable text, no more wasted time. Just clean insights, on demand — powered by AI, built with care, and evolving every day.
            </p>
          </motion.div>
        </div>

    
        {!auth && (
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-20 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Want to experience the future of document intelligence?
            </h3>
            <Link
              to="/signin"
              className="inline-block mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 px-6 py-3 rounded-full text-white text-lg font-semibold transition"
            >
              Start Using DL-Scanner
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default About;
