import axios from "axios";

import axios from "axios";

// Base URL from environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Request Interceptor (attach token automatically)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (handle 401 & refresh token)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and refresh not attempted yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });


          const newToken = res.data.token;
          localStorage.setItem("token", newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
