import { useState, useEffect } from 'react';
import { getUserData } from '../services/getUserData'; // Adjust path as needed

const useUserData = (apiBaseUrl) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserData(apiBaseUrl);
        if (isMounted) {
          setUserData(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]); // Dependency array: re-run effect if apiBaseUrl changes

  return { userData, loading, error };
};

export default useUserData;