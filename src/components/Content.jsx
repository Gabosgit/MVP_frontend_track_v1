import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Footer from "./Footer";

// Display load, error, or htmlContent
export default function Content({pageName, loading, error, htmlContent }) {
    const { user, setUser } = useContext(AuthContext);
    const { pathname } = location;

    if (loading) {
      return (
        <div className="flex min-h-screen justify-center items-center h-64">
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
      <div className="flex flex-col justify-between min-h-screen">
        <div>
          {user && user.username && pathname !== "/sign_up" && pathname !== "/login" && pathname !== "/about" && pathname !== "/" && 
            <div className="flex flex-col mt-20 mr-20 items-end text-right mb-10 pr-4 animate-slideInUp">
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end dark:from-dark-purple-start dark:to-dark-purple-end">
                    Hello, {user.username}!
                </h2>
              </div>

              <p className="text-xl font-semibold text-gray-500">
                  you are in section <span className="text-2xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
                dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                    {pageName}
                </span>
              </p>
            </div>
          }
          <div className="flex flex-col items-center pb-32">
            {htmlContent}
          </div>
        </div>
        <Footer />
      </div>
    );
  }


