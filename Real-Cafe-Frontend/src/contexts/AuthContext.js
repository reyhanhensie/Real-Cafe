import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import URL_API from "../apiconfig";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const response = await axios.get(`${URL_API}/user`);
          setUserRole(response.data.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error fetching user role", error);
          setIsAuthenticated(false);
          Cookies.remove("token");
          Cookies.remove("role");
          navigate("/login");
        }
      } else {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
