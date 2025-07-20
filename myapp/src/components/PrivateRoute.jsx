import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null; 

  return auth ? children : <Navigate to="/signin" />;
};

export default PrivateRoute;
