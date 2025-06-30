// -- Added useCallback
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { UserDataService } from "../services/UserDataService";
import { login as authServiceLogin } from "../services/AuthService"; // Your login service (renamed to avoid conflict)
import {ApiContext} from "../context/ApiContext"
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection (assuming React Router v6+)


// -- Manage an isAuthenticated state within AuthProvider that changes when a user logs in or out.
export const AuthContext = createContext(

);

export function AuthProvider({ children }) {
  const apiBaseUrl = useContext(ApiContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate(); // Initialize the navigate hook for redirection
  
// --- Helper function to fetch user data and update state ---
  // Memoize with useCallback to prevent unnecessary re-creations,
  // especially if passed down to useEffect or other components.
  const fetchAndSetUser = useCallback(async () => {
    setLoading(true); // Indicate loading has started
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const userData = await UserDataService(apiBaseUrl); // Use UserDataService service
        setUser(userData);
        setIsAuthenticated(true);
        console.log("AuthContext: User data fetched and set.");
      } catch (error) {
        console.error("AuthContext: Failed to fetch user data (token might be invalid/expired):", error);
        // If fetching user data fails, assume token is invalid or expired
        localStorage.removeItem("token"); // Clear the bad token
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // No token found, so user is not authenticated
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false); // Indicate loading has finished
  }, [apiBaseUrl]); // Depend on apiBaseUrl, as UserDataService uses it



  // --- useEffect for initial load/re-authentication check ---
  useEffect(() => {
    // This effect runs once on mount to check for an existing session
    // and whenever fetchAndSetUser changes (which is only if apiBaseUrl changes)
    fetchAndSetUser();
  }, [fetchAndSetUser]); // This dependency means it re-runs if fetchAndSetUser definition changes



  // --- Login Function to be exposed via context ---
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      // Use your existing login service to get the token
      const response = await authServiceLogin(username, password, apiBaseUrl);
      // The login service already stores the token in localStorage
      console.log("AuthContext: Login successful, token stored.");

      // After successful login and token storage, immediately fetch user data
      await fetchAndSetUser(); // This will update user, isAuthenticated, and loading states
      return response; // Return the full response if needed by the calling component
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      localStorage.removeItem("token"); // Ensure token is cleared on login failure
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false); // Make sure loading state is reset even on error
      throw error; // Re-throw to allow component (e.g., Login page) to handle error
    }
  }, [apiBaseUrl, fetchAndSetUser]); // Depend on apiBaseUrl and fetchAndSetUser



  // --- Logout Function to be exposed via context ---
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    console.log("AuthContext: User logged out.");
    // Redirect to the home page "/" after logout
    navigate('/');
  }, []); // No dependencies needed for logout


  
  // --- Context value to be provided to consumers ---
  const contextValue = {
    user,
    setUser, // Allows direct setting of user (e.g., if profile is updated)
    loading,
    isAuthenticated,
    login,   // Expose login function to any component that uses AuthContext
    logout,  // Expose logout function to any component that uses AuthContext
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}