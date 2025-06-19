import { useState, useEffect, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import { fetchUserContracts } from '../services/ContractsService';

// Create the custom hook useUserProfiles
export const useUserContracts = (userId) => {
  const apiBaseUrl = useContext(ApiContext);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserContracts(apiBaseUrl, userId);
        setContracts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Only fetch if userId is available
      loadContracts();
    }
  }, [userId, apiBaseUrl]);

  // The custom hook returns the state
  return { contracts, loading, error };
};