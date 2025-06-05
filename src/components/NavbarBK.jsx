import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({pageName}) {
  const { user, setUser, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div>
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Left section: Logo and welcome message */}
          <div className="flex flex-col md:flex-row items-start space-y-2 md:items-end md:space-y-0 md:space-x-4">
            <h1 className="text-black font-bold">myMVP1.0</h1>
          </div>

          {/* Desktop Navigation - visible at md and larger */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-black">
              Home
            </Link>
            <Link to="/about" className="text-black">
              About
            </Link>
            {!user && pathname !== "/login" && (
              <Link to="/login">
                <button className="bg-blue-800 text-white py-1 px-3 rounded">
                  Login
                </button>
              </Link>
            )}
            {!user && pathname !== "/sign_up" && (
              <Link to="/sign_up">
                <button className="bg-green-600 text-white py-1 px-3 rounded">
                  Sign Up
                </button>
              </Link>
            )}
            {user && (
              <>
                <Link to="/dashboard">
                  <button className="bg-blue-800 text-white py-1 px-3 rounded">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-black text-blue-500 py-1 px-3 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle - visible on small screens */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  // Display a close icon (X) when the mobile menu is open
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.3 5.71a1 1 0 00-1.42-1.42L12 9.17 7.12 4.29A1 1 0 105.7 5.71L10.58 10.6l-4.88 4.88a1 1 0 101.42 1.42L12 12l4.88 4.88a1 1 0 001.42-1.42l-4.88-4.88 4.88-4.88z"
                  />
                ) : (
                  // Display a hamburger icon (three lines) when the mobile menu is closed
                  <path
                    d="M4 6h16M4 12h16M4 18h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              {!user && pathname !== "/login" && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="bg-white text-blue-500 py-1 px-3 rounded">
                    Login
                  </button>
                </Link>
              )}
              {!user && pathname !== "/sign_up" && (
                <Link
                  to="/sign_up"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="bg-green-500 text-white py-1 px-3 rounded">
                    Sign Up
                  </button>
                </Link>
              )}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <button className="bg-white text-blue-500 py-1 px-3 rounded">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="flex flex-col items-end mr-20 p-10">
        {/*<p>Hello {user.username}, you are in section</p>*/}
        {user && user.username && <p>Hello {user.username}, you are in section</p>}
        <h1>{pageName}</h1>
      </div>
    </div>
  );
}
