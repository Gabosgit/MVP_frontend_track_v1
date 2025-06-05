import React, { useEffect, useState, useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Content from "../components/Content";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


function UserProfilesContent({ profiles }) {
  if (!profiles) 
    return <div className="text-gray-500">No profiles data available.</div>;

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
  )
}


export default function UserProfiles() {
  const apiBaseUrl = useContext(ApiContext);
  const { id } = useParams(); // Gets the "id" from the URL (e.g., /user/1/profiles)
  const [profiles, setProfiles] = useState([]); // Holds the user profiles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserProfiles() {
      try {
        if (!id) {
          throw new Error("User ID is missing!");
        }

        const token = localStorage.getItem("token"); // Retrieve authentication token

        const response = await fetch(`${apiBaseUrl}/user/${id}/profiles`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user profiles.");
        }

        const data = await response.json();
        console.log("API Response:", data); // 🔍 Debugging API response
        setProfiles(data.user_profiles); // Update state with profiles
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfiles();
  }, [id]); // ✅ Dependency added

  // ✅ RETURN the JSX to ensure React renders it
    return (
      <Content 
        pageName={"Profiles"}
        loading={loading} 
        error={error}
        htmlContent={<UserProfilesContent profiles={profiles} />} 
      />
    );
}
