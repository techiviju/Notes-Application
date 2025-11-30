 
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Props: children, adminOnly (boolean; default false)
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a loading screen if the auth state is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // If no user (not authenticated), redirect to login and preserve the original path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If this is an admin-only route but the user is not an admin, redirect to home
  if (adminOnly && !user.roles?.includes("ADMIN")) {
    return <Navigate to="/" replace />;
  }

  // Authorized: show the protected page/component
  return children;
}
