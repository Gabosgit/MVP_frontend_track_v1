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
    </div>
    

  )
}