import axios from "axios";

export const login = async (username, password, apiBaseUrl) => {
  
  try {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const response = await axios.post(`${apiBaseUrl}/token`, params, {
    // const response = await axios.post(`${process.env.API_BASE_URL}/${token}`, params, {

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    
      console.log("API Login Response:", response.data); // Debug log

      // Extract token from the key access_token returned from api
      const token = response.data.access_token;

      if (!token) {
          throw new Error("Token not found in API response");
        }

      localStorage.setItem("token", token); // Store token
      return response.data;
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error.message);
    throw error;
  }
};