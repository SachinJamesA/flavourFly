import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Simulate logout
    // setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    navigate("/login");
    alert("Logged out successfully!");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">FlavourFly</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/customermenu"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Menu
            </Link>
            <Link
              to="/customerorder"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Orders
            </Link>
            {localStorage.getItem("accessToken") && (
              <Link
                to="/customerprofile"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Profile
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex space-x-4">
            {localStorage.getItem("accessToken") ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleMenuToggle}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-2 mt-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/customermenu"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link
                to="/customerorder"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              {localStorage.getItem("accessToken") && (
                <Link
                  to="/customerprofile"
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              {localStorage.getItem("accessToken") ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-blue-600 border border-blue-500 rounded hover:bg-blue-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
