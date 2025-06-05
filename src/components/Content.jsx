import React from "react";

// Display load, error, or htmlContent
export default function Content({loading, error, htmlContent }) {
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
      <div className="flex flex-col items-center">
        {htmlContent}
      </div>
    );
  }
  