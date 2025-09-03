import React from 'react';
import Footer from "./Footer";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import BackButton from "./BackButton"

 
// Display load, error, or htmlContent, and accept the `editing` prop
export default function Content({pageName, loading, error, htmlContent, editing, setEditing }) {
  const { user, setUser } = useContext(AuthContext);
  const currentPathname = location.pathname; // Extract the pathname

  // Add a conditional checking if htmlContent is a valid React element
    let contentWithProps = htmlContent;
    if (React.isValidElement(htmlContent)) {
        contentWithProps = React.cloneElement(htmlContent, { editing });
    }

  const buttonText = editing ? 'Save' : 'Edit';
  const buttonShareCancel = editing ? 'cancel' : 'share';

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

  function toggleEditingMode() {
    setEditing((prev => !prev))
  }
  

  return (
      <>
        <div className="flex flex-col min-h-screen justify-between">
          <div className="flex flex-col items-center w-screen pb-32">
            {user && (
              <>
                
                <div className="flex mt-24 w-2/3 justify-between">
                  <div>
                    {currentPathname !== "/dashboard" && (
                      <BackButton />
                    )}
                  </div>
                  
                  {currentPathname.startsWith("/profile/") && currentPathname !== "/profile/create" && (
                    <div>
                      <button className="btn btn-secondary" onClick={toggleEditingMode}>
                      {buttonText}
                      </button>
                      <button className="btn btn-secondary">
                        {buttonShareCancel}
                      </button>
                    </div>
                  )}
                  
                  
                  <p className="text-xl text-right font-semibold">
                    You are in the section<br />
                    <span className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
                  dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                      {pageName}
                    </span>
                  </p>
                </div>
              </>
            
            )}

            <div className="w-3/5">
              {contentWithProps}
            </div>

          </div>
          <Footer />
        </div>
          
        
      </>
        
  );
}


