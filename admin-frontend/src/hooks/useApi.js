import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useApi() {
  const { authTokens } = useContext(AuthContext);

  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8000",
  });

  // Request interceptor to add Authorization header
  api.interceptors.request.use(
    (config) => {
      if (authTokens?.access_token) {
        config.headers.Authorization = `Bearer ${authTokens.access_token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for debugging and graceful error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Backend responded with a status outside 2xx
        console.error("API Response Error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // No response received (possible CORS or network issue)
        console.error("No Response Received:", error.request);
      } else {
        // Error setting up the request
        console.error("Axios Setup Error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return api;
}
