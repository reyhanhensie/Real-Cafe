import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import URL_API from "../apiconfig";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [User, setUser] = useState({});

  const isTokenExpired = (token) => {
    if (!token) return true; // No token present

    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    return decoded.exp < currentTime;
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = Cookies.get("token");
      try {
        // Get token from cookies
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (token) {
          const response = await axios.get(`${URL_API}/user`);
          setUserRole(response.data); // Set the user data to state
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
      if (isTokenExpired(token)) {
        console.log("Token has expired. Redirect to login or refresh token.");
      } else {
        console.log("Token is valid.");
      }
    };

    // Fetch only if userRole is still null
    if (userRole === null) {
      fetchUserRole();
    } else {
    }
  });

  return (
    <AuthContext.Provider value={{ userRole }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
