
import React from "react";
import { ArrowRight, ScanLine, Brain, Zap } from "lucide-react";
import { motion } from "framer-motion";


const features = [
  {
    title: "Smart OCR",
    icon: <ScanLine className="w-8 h-8 text-blue-400" />,
    desc: "Extract clean, structured text from images and PDFs using cutting-edge deep learning models.",
  },
  {
    title: "AI Summarization",
    icon: <Brain className="w-8 h-8 text-purple-400" />,
    desc: "Summarize large documents in a single click using transformer-powered NLP models.",
  },
  {
    title: "Blazing Fast",
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    desc: "Lightning fast backend with TensorFlow + Node.js. Get OCR + summary in seconds.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-white px-6 py-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Your AI Document Assistant
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Upload, scan, extract, and summarize any document instantly using state-of-the-art deep learning technology.
        </p>
        <a
          href="/signin"
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
        >
          Try It Now <ArrowRight className="ml-3 w-5 h-5" />
        </a>
      </motion.section>

      {/* Features Section */}
      <section className="mt-32 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-32 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {["Upload", "OCR", "Summarize", "Download"].map((step, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: i * 0.2 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700"
            >
              <div className="text-4xl font-bold text-blue-400 mb-2">{i + 1}</div>
              <p className="text-white font-medium">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <motion.section
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-40 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl font-bold mb-4">Ready to experience the future of documents?</h2>
        <p className="text-gray-300 text-lg mb-6">
          Sign up now and make your documents work for you with our AI-powered engine.
        </p>
        <a
          href="/signin"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 px-8 py-3 rounded-full text-white text-lg font-semibold transition"
        >
          Get Started for Free
        </a>
      </motion.section>
    </div>
  );
};

export default Home;
