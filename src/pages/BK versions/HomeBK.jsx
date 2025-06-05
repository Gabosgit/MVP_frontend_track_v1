import Layout from "../components/Layout";
import { Link } from "react-router-dom"; // Importing Link for navigation
import { PageWrapper } from "../components/PageWrapper";


export default function Home() {

  // ✅ RETURN the JSX to ensure React renders it
    return (
      <PageWrapper 
        htmlContent={<HomeContent />} 
      />
    );
}


function HomeContent() {
  return (
      <div className="flex flex-col space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-center">Welcome to my MVP 1.0</h1>
          <p className="text-xl text-gray-600 max-w-2xl text-center">This app allows to create contracts between perforners and producers!</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
          <Link to="/sign_up">
            <button
                type="button"
                className="w-full bg-green-600 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Create Account
              </button>
          </Link>
          </div>
          <div>
            <Link to="/login">
              <button
                type="button"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
  );
}
