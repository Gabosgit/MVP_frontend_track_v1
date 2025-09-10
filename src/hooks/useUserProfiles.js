import { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { fetchUserProfiles } from '../services/ProfilesService';

// Create the custom hook useUserProfiles
export const useUserProfiles = (userId) => {
  const apiBaseUrl = useContext(ApiContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfiles(apiBaseUrl, userId);

        // Sort the profiles by updated_at in descending order (most recent first)
        const sortedData = [...data].sort((a, b) => {
          const dateA = new Date(a.updated_at);
          const dateB = new Date(b.updated_at);
          return dateB - dateA;
        });

        setProfiles(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Only fetch if userId is available
      loadProfiles();
    }
  }, [userId, apiBaseUrl]);

  // The custom hook returns the state
  return { profiles, loading, error };
};