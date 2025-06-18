import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Content from "../components/Content";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// 1. Import the new service
import { fetchUserProfiles } from "../services/profilesService"; 

// This sub-component remains unchanged
function UserProfilesContent({ profiles }) {
  if (!profiles || profiles.length === 0) {
    return <div className="text-gray-500">No profiles found for this user.</div>;
  }

  return (
    <ul className="space-y-4">
      {profiles.map(profile => (
        <li key={profile.id} className="border rounded p-4 shadow-sm">
          <h3 className="text-xl font-bold">{profile.name}</h3>
          <Link to={`/profile/${profile.id}`} className="text-blue-500 hover:underline">
            View Profile
          </Link>
        </li>
      ))}
    </ul>
  );
}


export default function UserProfiles() {
  const apiBaseUrl = useContext(ApiContext);
  const { id } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. The data fetching logic is now clean and simple
    const loadProfiles = async () => {
      try {
        setLoading(true);
        // 3. Call the service function with the required parameters
        const userProfilesData = await fetchUserProfiles(apiBaseUrl, id);
        setProfiles(userProfilesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [id, apiBaseUrl]); // Include apiBaseUrl as a dependency

  // The JSX for rendering remains the same
  return (
    <Content 
      pageName={"Profiles"}
      loading={loading} 
      error={error}
      htmlContent={<UserProfilesContent profiles={profiles} />} 
    />
  );
}