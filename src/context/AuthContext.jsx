import React, { createContext, useState, useEffect, useContext } from "react";
import { getUserData } from "../services/getUserData";
import {ApiContext} from "../context/ApiContext"

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const apiBaseUrl = useContext(ApiContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Replace static data with your actual API call
      const fetchUser = async () => {
        try {
          const userData = await getUserData(apiBaseUrl);
          setUser(userData); // Update the user state with API response
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
