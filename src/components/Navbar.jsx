import React, { useContext, useState, useEffect, useRef} from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Greeting from "./Greeting";
import Sidebar from "./Sidebar";


export default function Navbar() { // <-- Accept onHeightChange prop
  const [dark, setDark] = React.useState(false);
  const { user, setUser, loading, logout, isAuthenticated } = useContext(AuthContext);
  const [themeStatus, seThemeStatus] = useState("☀️ Light");
  const location = useLocation(); // Get the current location object
  const currentPathname = location.pathname; // Extract the pathname
  const navbarRef = useRef(null); // Create a ref for the navbar element
  const [navbarHeight, setNavbarHeight] = useState(0); // State to store navbar height
  const [isOpen, setIsOpen] = useState(false);

    // Effect to measure navbar height after render and handle scroll
    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight); // This should now always show correct height
        }
    }, []);
  
  const darkModeHandler = () => {
      setDark(!dark);
      document.documentElement.classList.add('dark');
      seThemeStatus(dark ? "☀️ Light" : "🌙 Dark")
      !dark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
  }

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default form submission or link navigation
    if (window.confirm('Are you sure you want to logout?')) {
      // Call the logout function from AuthContext
      logout();
    }
  };

  return (
    <div>
        <nav ref={navbarRef}
        id="navbar" className="fixed top-0 left-0 right-0 w-full z-[1000] min-h-[80px]
        bg-gradient-to-br from-[#f8f9ff] to-[rgb(147,130,173)] 
        dark:from-[#23003d] dark:to-[#12061c] backdrop-blur-xl  py-3.5 
        transition-all duration-300 ease-in-out">

            <div className="flex px-4 sm:px-6 lg:px-8 justify-between items-center">

                <div className="flex gap-6">
                    {isAuthenticated &&
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="top-3.5 left-8 z-[1050] p-2 rounded-md dark:bg-opacity-40
                                    bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border dark:border-custom-purple-end
                                    shadow-lg transition-colors duration-200 focus:outline-none focus:bg-custom-purple-start focus:bg-opacity-5"
                            aria-label="Toggle sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                >
                                </path>
                            </svg>
                        </button>
                    }
                    
                
                    <div className="ml-0 xl:ml-40  text-3xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end text-transparent">
                        CreativePro
                    </div>
                </div>
                
                <div className="xl:mr-44 nav-links hidden md:flex items-center space-x-8">

                    {isAuthenticated &&
                        <Greeting />
                    }

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
                                <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-purple-200 dark:bg-gray-900 hover:bg-gray-100 rounded-md group-hover:dark:bg-transparent">
                                    Sign Up
                                </span>
                        </Link>
                    )}
                    {user && (
                        <>
                            <Link to="/dashboard" 
                                className="hidden lg:flex btn-primary
                                font-semibold rounded-lg text-sm px-5 py-2.5 text-center">
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
        {isAuthenticated &&
            <Sidebar navbarHeight={navbarHeight} isOpen={isOpen}/>
        }
        
        {/* Sidebar Overlay (Dark backdrop when sidebar is open) */}
        {isOpen && (
            <div
            id="sidebarOverlay"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] opacity-100 visible transition-opacity duration-300"
            ></div>
        )}
    </div>
  );
}