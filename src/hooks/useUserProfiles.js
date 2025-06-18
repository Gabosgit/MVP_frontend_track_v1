import { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { fetchUserProfiles } from '../services/profilesService';

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
        setProfiles(data);
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