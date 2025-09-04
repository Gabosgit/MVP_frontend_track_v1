import axios from "axios";

export const UserDataService = async (apiBaseUrl) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.get(`${apiBaseUrl}/user/me/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Send Bearer Token
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

export const updateUserDataService = async (apiBaseUrl, updatedData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User is not authenticated");
  }
  try {
    // Assuming your backend expects a PUT request to /user/me/ to update user data.
    // Adjust the endpoint and method (e.g., PATCH) if your API differs.
    const response = await axios.patch(`${apiBaseUrl}/user`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Send Bearer Token
      },
    });
    return response.data; // Return the updated data from the backend
  } catch (error) {
    console.error("Failed to update user data:", error.response ? error.response.data : error.message);
    throw error;
  }
};
