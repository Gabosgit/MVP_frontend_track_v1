import axios from "axios";

export const getUserData = async (apiBaseUrl) => {
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
