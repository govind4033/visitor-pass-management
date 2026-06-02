import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomeRedirect() {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Employee
  if (user.role === "employee") {
    return <Navigate to="/employee" replace />;
  }

  // Security
  if (user.role === "security") {
    return <Navigate to="/security" replace />;
  }

  // Visitor
  if (user.role === "visitor") {
    return <Navigate to="/visitor" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
}