import React, { useContext, useState, useEffect, useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Greeting from "./Greeting";


export default function Navbar({onHeightChange}) { // <-- Accept onHeightChange prop
  const [dark, setDark] = React.useState(false);
  const { user, setUser, loading } = useContext(AuthContext);
  const [themeStatus, seThemeStatus] = useState("☀️ Light");
  const location = useLocation(); // Get the current location object
  const currentPathname = location.pathname; // Extract the pathname
  const navbarRef = useRef(null); // <-- Create a ref for the navbar element

   // Effect to measure navbar height after render
// Effect to measure navbar height after render and handle scroll
    useEffect(() => {
    //console.log('Navbar useEffect ran.');
    //console.log('navbarRef.current at start of useEffect:', navbarRef.current);

    if (navbarRef.current) {
      //console.log("navbarRef.current exists!");
      const height = navbarRef.current.offsetHeight;
      //console.log(`Measured Navbar Height: ${height}px`); // This should now always show correct height
      if (onHeightChange) {
        onHeightChange(height);
      }
    } else {
      console.log("navbarRef.current is null.");
    }

  }, [onHeightChange]);
  
  const darkModeHandler = () => {
      setDark(!dark);
      document.documentElement.classList.add('dark');
      seThemeStatus(dark ? "☀️ Light" : "🌙 Dark")
      !dark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsMobileMenuOpen(false);
    navigate("/");
  };


  return (
    <div>
        <nav ref={navbarRef} // <-- Ensure this ref is attached to your <nav> element
        id="navbar" className="fixed top-0 left-0 right-0 w-full z-[1000] min-h-[80px]
        bg-white dark:bg-[#23003d] backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-nav-border py-3.5 
        transition-all duration-300 ease-in-out">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end text-transparent">
                    CreativePro
                </div>

                <div className="nav-links hidden md:flex items-center space-x-8">
                    
                    <Greeting />

                    {!user && (
                        <>
                            <Link to="/" className="nav-link-item text-gray-700 dark:text-gray-300 hover:text-custom-purple-start dark:hover:text-indigo-400 font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-custom-purple-start after:to-custom-purple-end after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-px">
                                Home
                            </Link>
                            <Link to="/about" className="nav-link-item text-gray-700 dark:text-gray-300 hover:text-custom-purple-start dark:hover:text-indigo-400 font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-custom-purple-start after:to-custom-purple-end after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-px">
                                About
                            </Link>
                        </>
                    )}
                    {!user && currentPathname !== "/login" && (
                        <Link to="/login" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 
                        dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Login
                        </Link>
                    )}
                    {!user && currentPathname !== "/sign_up" && (
                        <Link to="/sign_up" className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-600 hover:text-dark-purple-start dark:text-white dark:hover:text-dark-purple-start focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 hover:bg-gray-100 rounded-md group-hover:dark:bg-transparent">
                                    Sign Up
                                </span>
                        </Link>
                    )}
                    {user && (
                        <>
                            <Link to="/dashboard" className="btn-primary font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
                                Dashboard
                            </Link>
                            <Link onClick={handleLogout} className="font-semibold text-[#b829ff] py-1 rounded">
                                Logout
                            </Link>
                        </>
                    )}
                    <Link onClick={darkModeHandler} className="nav-link-item text-gray-700 dark:text-gray-300 hover:text-custom-purple-start dark:hover:text-indigo-400 font-medium transition-all duration-300 relative after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-custom-purple-start after:to-custom-purple-end after:transition-all after:duration-300 hover:after:w-full hover:-translate-y-px">
                            {themeStatus}
                    </Link>
                </div>
            </div>
        </nav>
    </div>
  );
}