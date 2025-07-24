// src/Components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// This checks if user is logged in — adjust as needed
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
