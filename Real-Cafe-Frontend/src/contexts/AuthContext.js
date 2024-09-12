import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import URL_API from '../apiconfig';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [User,setUser] =useState({});


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Get token from cookies
        const token = Cookies.get("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        if (token) {
          const response = await axios.get(`${URL_API}/user`);
          setUser(response.data); // Set the user data to state
          setUserRole(response.data.role); // Assuming role is part of the user data
          console.log(userRole);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    // Fetch only if userRole is still null
    if (userRole === null) {
      fetchUserRole();
    }
    else{
      console.log(userRole);
    }
  }); 

  return (
    <AuthContext.Provider value={{ userRole  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
