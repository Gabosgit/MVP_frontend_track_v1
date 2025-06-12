import Footer from "./Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Display load, error, or htmlContent
export default function Content({pageName, loading, error, htmlContent }) {
  const { user, setUser } = useContext(AuthContext);

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
      <>
        <div className="flex flex-col min-h-screen justify-between">
          <div className="flex flex-col items-center w-screen pb-32">
            {user && (
            <div className="flex mt-24 w-full justify-end pr-[18%]">
              <p className="text-xl text-right font-semibold">
                You are in the section<br />
                <span className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
              dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                  {pageName}
                </span>
              </p>
            </div>
            )}

            {htmlContent}

          </div>
          <Footer />
        </div>
          
        
      </>
        
  );
}


