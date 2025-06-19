/**
 * Fetches user profiles from the API.
 *
 * @param {string} apiBaseUrl - The base URL of the API.
 * @param {string} userId - The ID of the user whose profiles are to be fetched.
 * @returns {Promise<Array>} A promise that resolves to an array of user profiles.
 * @throws {Error} Throws an error if the user ID is missing or the API call fails.
 */
export const fetchUserContracts = async (apiBaseUrl, userId) => {
  if (!userId) {
    throw new Error("User ID is missing!");
  }

  const token = localStorage.getItem("token"); // Retrieve authentication token

  // Construct the request URL
  const url = `${apiBaseUrl}/user/${userId}/contracts`;

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  // It throws a detailed error that the component can catch and display.
  if (!response.ok) {
    // Attempt to parse error details from the response body
    const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON error responses
    throw new Error(errorData.message || `Failed to fetch user contracts. Status: ${response.status}`);
  }

  const data = await response.json();

  // The service returns the core data the component needs
  return data.user_contracts || [];
};