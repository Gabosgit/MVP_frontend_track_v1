import { useEffect, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Link, useNavigate } from "react-router-dom";
import Content from "../components/Content";
import useUserData from '../hooks/useUserData'; // Adjust path as needed
import ProfilesDashboard from "../components/ProfilesDashboard";
import { useUserProfiles } from "../hooks/useUserProfiles"

export default function Dashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const apiBaseUrl = useContext(ApiContext);
    // Get user data, loading state, and error from the custom hook
    const { userData, loading: userLoading, error: userError } = useUserData(apiBaseUrl);

    // Initialize profiles and profilesLoading with default values
    // They will only get actual values when userData.id is available
    const { profiles, loading: profilesLoading, error: profilesError } = useUserProfiles(userData?.id);

    // Combine loading and error states for the Content component
    const isLoading = userLoading || profilesLoading;
    const hasError = userError || profilesError;

  // Handle redirection if there's an error (e.g., unauthorized)
  // This useEffect will run whenever 'error' changes
  useEffect(() => {
    if (hasError) {
      // You can add more specific error handling here if needed
      console.error("Dashboard error:", hasError);
      // Redirect to login if the error indicates unauthentication
      // You might want to check for specific error codes like 401 from your API
      if (hasError.message === "User is not authenticated" || hasError.response?.status === 401) {
        navigate("/login");
      }
    }
  }, [hasError, navigate]); // Dependencies for useEffect

  // ✅ RETURN the JSX to ensure React renders it
      return (
          <Content 
              pageName={"Dashboard"}
              loading={isLoading} 
              error={hasError}
              htmlContent={ 
                userData ? <CreateDashboardContent userData={userData} profiles={profiles} /> 
                : null 
              }
          />
      );
};

  
function CreateDashboardContent({userData, profiles}) {
  return(
    <div className="grid grid-cols-1 max-w-screen-xl mt-16">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <ProfilesDashboard userData={userData}  profiles={profiles} />

            <div className="flex flex-col justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 interactive-card">
                
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold title-gradient">Contracts</h2>
                        <Link to={`/user/${userData?.id}/contracts`} className="text-sm font-semibold text-brand-indigo hover:underline">
                            View All
                        </Link>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-white">Summer Gala 2025</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Tech Corp • $12,500</p>
                            </div>
                            <span className="text-xs font-bold py-1 px-3 rounded-full bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-white">Johnson Wedding</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Private Client • $8,750</p>
                            </div>
                            <span className="text-xs font-bold py-1 px-3 rounded-full bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">Pending</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-gray-700/50">
                            <div>
                                <h4 className="font-semibold text-gray-800 dark:text-white">Product Launch</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">StartupXYZ • $6,200</p>
                            </div>
                            <span className="text-xs font-bold py-1 px-3 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200">Draft</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">$42K</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contracts</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">92%</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                    </div>
                </div>
            </div>
        </div>

        <h2 className="font-bold text-2xl text-center mt-20">QUICK START</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 text-gray-900 dark:text-white">
            <div className="order-2 md:order-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center interactive-card">
                <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4">
                    👤
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Create Profile
                </h3>
                <p className="text-sm font-semibold text-stone-800 dark:text-gray-400">
                    Set up a new professional profile to showcase your services.
                </p>
                <ul className="flex flex-col py-10 text-left list-disc list-inside text-sm space-y-1
                                 text-gray-500 dark:text-gray-400">
                    <li>You can create many profiles to offer different services.</li>
                    <li>Add detailed information about your projects.</li>
                    <li>Select a profile to make contracts with other users.</li>
                </ul>
                <Link to="/profile/create" className="btn-primary w-2/3 text-center font-semibold  py-2 px-4 rounded-lg hover:opacity-90 transition">
                    Get Started
                </Link>
            </div>

            <div className="order-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-md p-6 text-center flex flex-col items-center justify-center interactive-card">
                <div className="icon-gradient w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4">
                    📋
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Create Contract
                </h3>
                <p className="text-sm font-semibold text-stone-800 dark:text-gray-400">
                    Generate professional contracts with our templates.
                </p>
                <ul className="flex flex-col py-10 text-left list-disc list-inside text-sm space-y-1
                                 text-gray-500 dark:text-gray-400">
                    <li>Ensure you enter the mandatory fields.</li>
                    <li>Add events and milestones to the contract.</li>
                    <li>Once ready, send it to your client for approval.</li>
                </ul>
                <Link to="/contract/create" className="btn-primary w-2/3 text-center font-semibold  py-2 px-4 rounded-lg hover:opacity-90 transition">
                    New Contract
                </Link>
            </div>

        </div>
    </div>
    

  )
}