import React, { useState, useEffect, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { Link } from "react-router-dom";
import { getUserData } from "../services/getUserData";
import { PageWrapper } from "../components/PageWrapper";

export default function Dashboard() {
  const apiBaseUrl = useContext(ApiContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getUserData(apiBaseUrl);
          setUserData(data);
        } catch (error) {
          setError(err.message);
          window.location.href = "/login"; // Redirect if unauthorized
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

  // ✅ RETURN the JSX to ensure React renders it
      return (
          <PageWrapper 
              pageName={"Dashboard"}
              loading={loading} 
              error={error}
              htmlContent={
                  <CreateDashboardContent userData={userData} />
              }
          />
      );
};

  
function CreateDashboardContent({userData}) {
  // if (!userData) return <p>Loading user data...</p>; // ✅ Prevent crashes when userData is null

  return(
    <div className="max-w-4xl mx-auto py-8">
        
      {/* Account row */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Account</h2>
        <Link to="/user">
          <button className="bg-blue-500 text-black py-2 px-4 rounded hover:bg-blue-600">
            See your data
          </button>
        </Link>
      </div>

      {/* Profiles row */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Profiles</h2>
        <div className="flex space-x-4">
          <Link to={`/user/${userData?.id}/profiles`}>
            <button className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-600">
              See profiles
            </button>
          </Link>
          <Link to="/profile/create">
            <button className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-600">
              Create profile
            </button>
          </Link>
        </div>
      </div>

      {/* Contracts row */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Contracts</h2>
        <div className="flex space-x-4">
        <Link to={`/user/${userData?.id}/contracts`}>
            <button className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-600">
              See contracts
            </button>
          </Link>
          <Link to="/contract/create">
            <button className="bg-green-800 text-white py-2 px-4 rounded hover:bg-green-600">
              Create contract
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}