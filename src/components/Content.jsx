import React from 'react';
import Footer from "./Footer";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import BackButton from "./BackButton"

 
// Display load, error, or htmlContent, and accept the `editing` prop
export default function Content({
  pageName, 
  loading, 
  error, 
  htmlContent, 
  editing, 
  setEditing, 
  handleSaveClick, 
  handleCancelClick, 
  editableProfileData}) {
  const { user, setUser } = useContext(AuthContext);
  const currentPathname = location.pathname; // Extract the pathname

  // Add a conditional checking if htmlContent is a valid React element
    let contentWithProps = htmlContent;
    if (React.isValidElement(htmlContent)) {
        contentWithProps = React.cloneElement(htmlContent, { editing, setEditing });
    }

  const buttonText = editing ? 'cancel' : 'edit';
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
          <div className="flex flex-col items-center w-screen">
            {user && (
              <div className="flex w-full px-4 sm:w-2/3 sm:px0 justify-between">
                <div className='flex items-center gap-3'>
                  {currentPathname !== "/dashboard" && (
                    <BackButton />
                  )}
                  {currentPathname.startsWith("/profile/") && currentPathname !== "/profile/create" && (
                    !editing ? (
                      <button
                        onClick={toggleEditingMode}
                        className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSaveClick(editableProfileData)}
                          className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelClick}
                          className="inline-flex justify-center py-2.5 px-6 text-sm font-medium rounded-md btn-primary bg-red-600 hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )

                  // <div className='flex gap-3'>
                  //   <button className="btn btn-secondary" onClick={toggleEditingMode}>
                  //   {buttonText}
                  //   </button>
                  //   <button className="btn btn-secondary">
                  //     {buttonShareCancel}
                  //   </button>
                  // </div>
                )}
                </div>

                <p className="text-xl text-right font-semibold">
                  You are in the section<br />
                  <span className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
                dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                    {pageName}
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-col items-center w-full sm:w-3/5 pb-10">
              {contentWithProps}
            </div>

          </div>
          <Footer />
        </div>
          
        
      </>
        
  );
}


