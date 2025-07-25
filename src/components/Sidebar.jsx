// src/components/Sidebar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function Sidebar({ navbarHeight, isOpen }) { // <-- Accept navbarHeight prop
  const location = useLocation();
  const { user, loading, isAuthenticated, logout } = useContext(AuthContext);
  

  
  // Define navigation links
  const menuSections = [
    {
      title: 'Main',
      links: [
        { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
        { name: 'Projects', path: '/projects', icon: '💼' },
        { name: 'Messages', path: '/messages', icon: '💬' },
      ],
    },
    {
      title: 'Discover',
      links: [
        { name: 'Find Creatives', path: '/find-creatives', icon: '🔍' },
        { name: 'Featured Work', path: '/featured-work', icon: '⭐' },
        { name: 'Analytics', path: '/analytics', icon: '📊' },
      ],
    },
    {
      title: 'Account',
      links: [
        { name: 'User Data', path: '/user', icon: '👤' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
        { name: 'Preferences', path: '/preferences', icon: '🎨' },
        { name: 'Billing', path: '/billing', icon: '💳' },
        { name: 'Help & Support', path: '/help', icon: '❓' },
        { name: 'Logout', path: '/logout', isLogout: true, icon: '🚪' },
      ],
    },
  ];

  if (user && user.id) {
    menuSections[0].links.splice(1, 0, ...[
      { name: 'Profiles', path: `/user/${user.id}/profiles`, icon: '🗂️' },
      { name: 'Contracts', path: `/user/${user.id}/contracts`, icon: '📋' },
    ])
  }



  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default form submission or link navigation
    if (window.confirm('Are you sure you want to logout?')) {
      //alert('Logging out...'); // This alert will show immediately
      // Call the logout function from your AuthContext
      logout();
    }
    setIsOpen(false); // Close the menu/modal after action
  };

  return (
    <>
      

      {/* Sidebar Menu */}
      <aside
        id="sidebar"
        className={`
          fixed left-0 bottom-0 w-[350px] max-w-[90vw] pt-5 pb-5
          bg-white dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700
          shadow-2xl overflow-y-auto z-[1000]
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ top: navbarHeight > 0 ? `${navbarHeight}px` : '0px' }} 
      >
        <div className="flex flex-col h-full">
            <div className="px-5 pb-5 border-b border-indigo-100 dark:border-gray-700 mb-5">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-purple-400 dark:to-indigo-300">
                    CreativePro
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional Creative Platform</div>
            </div>

            {menuSections.map((section, index) => (
            <React.Fragment key={section.title}>
                <div className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.title}
                </div>
                <nav className="">
                <ul className="space-y-1">
                    {section.links.map((link) => (
                    <li key={link.name}>
                        {link.isLogout ? (
                        <a
                            href={link.path}
                            onClick={handleLogout}
                            className="flex items-center p-3 rounded-lg text-base font-medium
                                        text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                                        transition-all duration-200"
                        >
                            <span className="w-5 h-5 mr-3 flex justify-center items-center">{link.icon}</span>
                            {link.name}
                        </a>
                        ) : (
                        <Link
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`
                            flex items-center px-5 py-2.5 rounded-lg text-base font-medium
                            ${location.pathname === link.path
                                ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm dark:bg-indigo-600 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'}
                            transition-all duration-200
                            `}
                        >
                            <span className="w-5 h-5 mr-3 flex justify-center items-center">{link.icon}</span>
                            {link.name}
                        </Link>
                        )}
                    </li>
                    ))}
                </ul>
                </nav>
                {index < menuSections.length - 1 && (
                <div className="h-px bg-gray-200 dark:bg-gray-700 mx-5 my-3"></div>
                )}
            </React.Fragment>
            ))}
        </div>
      </aside>
    </>
  );
}
