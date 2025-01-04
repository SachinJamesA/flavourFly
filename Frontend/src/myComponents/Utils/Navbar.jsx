import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
    alert("Logged out successfully!");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/v1/users/getUserDetails", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          navigate("/login");
          return;
        }

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        if (!data || !data.data) throw new Error("Invalid API response");

        setUser(data.data);
      } catch (err) {
        console.error(err.message || "Error fetching user data");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">FlavourFly</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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

            {token ? (
              <div className="relative">
                <div className="flex items-center space-x-2">
                  {/* Avatar */}
                  <img
                    src={user.avatar} // Replace with the path to your avatar image
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-200"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  />

                  {/* User Name */}
                  <span
                    className="text-gray-700 cursor-pointer hover:text-blue-600"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {user.username || "Not provided"}
                  </span>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 w-40 z-10">
                      <Link
                        to="/customerprofile"
                        className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/customerorder"
                        className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  {isDropdownOpen ? (
                    <FiChevronUp
                      className="text-gray-700 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  ) : (
                    <FiChevronDown
                      className="text-gray-700 cursor-pointer"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                </button>
              </Link>
            )
            }
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden text-gray-700 focus:outline-none"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-2 mt-2">
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
            <Link
              to="/customerprofile"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="block px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
