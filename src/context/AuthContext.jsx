import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // ✅ Register new user
  const register = async (name, email, password) => {
    try {
      const res = await API.post("/auth/register", { name, email, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error("Register error:", err);
      return {
        success: false,
        message: err.response?.data?.error || "Registration failed",
      };
    }
  };

  // ✅ Login (handles both user & admin)
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, refreshToken, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      return { success: true, user };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  };

  // ✅ Logout (clears all session data)
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.warn("Logout request failed, clearing local data anyway:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
