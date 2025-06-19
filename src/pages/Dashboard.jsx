import { useEffect, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Link, useNavigate } from "react-router-dom";
import Content from "../components/Content";
import useUserData from '../hooks/useUserData'; // Adjust path as needed
import ProfilesDashboard from "../components/ProfilesDashboard";
import { useUserProfiles } from "../hooks/useUserProfiles"
import ContractsDashboard from "../components/ContractsDashboard";
import { useUserContracts } from "../hooks/useUserContracts"

export default function Dashboard() {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const apiBaseUrl = useContext(ApiContext);
    // Get user data, loading state, and error from the custom hook
    const { userData, loading: userLoading, error: userError } = useUserData(apiBaseUrl);

    // Initialize profiles and profilesLoading with default values
    // They will only get actual values when userData.id is available
    const { profiles, loading: profilesLoading, error: profilesError } = useUserProfiles(userData?.id);
    const { contracts, loading: contractsLoading, error: contractsError } = useUserContracts(userData?.id);
    // Combine loading and error states for the Content component
    const isLoading = userLoading || profilesLoading || contractsLoading;
    const hasError = userError || profilesError|| contractsError;

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
                userData ? <CreateDashboardContent userData={userData} profiles={profiles} contracts={contracts} /> 
                : null 
              }
          />
      );
};

  
function CreateDashboardContent({userData, profiles, contracts}) {
  return(
    <div className="grid grid-cols-1 max-w-screen-xl mt-16">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <ProfilesDashboard userData={userData}  profiles={profiles} />

            <ContractsDashboard userData={userData} contracts={contracts} />
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