// src/components/ProtectedRoute.js
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import URL_API from "../apiconfig";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner"; // Import the LoadingSpinner component

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation(); // Use useLocation to preserve the intended location
  const token = Cookies.get("token");

  useEffect(() => {
    const checkAuthentication = async () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${URL_API}/user`);
          if (response.data.role === 'dapur' || response.data.role === 'admin') {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            Cookies.remove("token");
            Cookies.remove("role");
          }
        } catch (error) {
          console.error("Error fetching user role", error);
          setIsAuthenticated(false);
          Cookies.remove("token");
          Cookies.remove("role");
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, [token]);

  if (isAuthenticated === null) {
    return <LoadingSpinner />; // Show the loading spinner while checking authentication
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
