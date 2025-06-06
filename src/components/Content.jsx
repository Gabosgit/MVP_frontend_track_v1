import Footer from "./Footer";

// Display load, error, or htmlContent
export default function Content({pageName, loading, error, htmlContent }) {

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
          <div className="flex flex-col items-center pb-32">
            <div className="flex mt-24 w-full justify-end mr-[38%]">
              <p className="text-xl text-right font-semibold text-gray-500">
                You are in the section <br />
                <span className="text-4xl font-extrabold text-gradient bg-gradient-to-r from-custom-purple-start to-custom-purple-end 
              dark:from-custom-purple-start dark:to-[#740dbf] text-transparent">
                  {pageName}
              </span>
            </p>
            </div>
            
            {htmlContent}
          </div>
        <Footer />
      </div>
    );
  }


