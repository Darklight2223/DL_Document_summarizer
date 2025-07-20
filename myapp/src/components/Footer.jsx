import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { auth } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">DL-Scanner</h3>
          <p>Smart document scanning with OCR & AI summarization.</p>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-1">
            {auth ? (
              <>
                <li><Link to="/dashboard" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/profile" className="hover:text-white">Profile</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/signin" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Contact</h3>
          <ul className="space-y-1">
            <li>
              {/* change this to your actual contact email */}
              Email: <a href="mailto:support@dlscanner.ai" className="hover:text-white">support@dlscanner.ai</a>
            </li>
            <li>
              Twitter: <a href="#" className="hover:text-white">@DLScanner</a>
            </li>
            <li>© {new Date().getFullYear()} DL-Scanner. All rights reserved.</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
