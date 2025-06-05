import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

// Display load, error, or htmlContent
export default function Content({pageName, loading, error, htmlContent }) {
    const { user, setUser } = useContext(AuthContext);
    const { pathname } = location;

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
          <div className="text-xl font-semibold ml-5">Loading ...</div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="text-red-600 font-bold text-center py-8">
          Error: {error}
        </div>
      );
    }
  
    return (
      <>
        {user && user.username && pathname !== "/sign_up" && pathname !== "/login" && pathname !== "/about" && 
            <div className="pt-20 flex flex-col items-end mr-20">
                <p>Hello {user.username}, you are in section</p>
                <div className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                    {pageName}
                </div>
            </div>
        }
        <div className="flex flex-col items-center min-h-screen pb-32">
          {htmlContent}
        </div>
      </>
      
    );
  }
  