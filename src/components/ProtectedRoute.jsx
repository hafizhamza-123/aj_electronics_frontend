// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  // Admin trying to access user routes → redirect to admin dashboard
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}
