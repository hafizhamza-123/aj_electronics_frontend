// src/components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // If admin logged in → go to admin dashboard
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}
