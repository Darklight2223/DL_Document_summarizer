import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("dlscanner_token");
    if (token && !auth) setAuth({ token });
    if (!token && auth) setAuth(null);
  }, [auth, setAuth]);

  const handleLogout = () => {
    localStorage.removeItem("dlscanner_token");
    setAuth(null);
    navigate("/signin");
  };

  const links = auth
    ? [
      { name: "Home", href: "/dashboard" },  // Logged-in: Home = Dashboard
      { name: "About", href: "/about" },
      { name: "Profile", href: "/profile" }
    ]
    : [
      { name: "Home", href: "/" },           // Not logged-in: Home = Landing page
      { name: "About", href: "/about" },
      { name: "Sign In", href: "/signin" },
      { name: "Sign Up", href: "/signup" }
    ];


  return (
    <nav className="bg-gray-900 shadow-md fixed w-full z-20 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={auth ? "/dashboard" : "/"} className="text-xl font-semibold text-white tracking-wide">
            DL-Scanner
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-300 hover:text-white transition duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            {auth && (
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-white transition font-semibold ml-4"
              >
                Logout
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-white transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-gray-900">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-300 hover:text-white transition font-medium"
            >
              {link.name}
            </Link>
          ))}
          {auth && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block text-red-400 hover:text-white transition font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
