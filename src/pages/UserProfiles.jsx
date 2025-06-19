import React from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useUserProfiles } from '../hooks/useUserProfiles'; // Import custom hook
import Content from '../components/Content';

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
  const { id } = useParams();
  
  // All the state management logic is handled by the custom hook useUserProfiles
  const { profiles, loading, error } = useUserProfiles(id); // custom hook

  return (
    <Content 
      pageName={"Profiles"}
      loading={loading} 
      error={error}
      htmlContent={<UserProfilesContent profiles={profiles} />} 
    />
  );
}