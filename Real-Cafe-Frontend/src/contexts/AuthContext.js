import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import URL_API from '../apiconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const response = await axios.get(`${URL_API}/me`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
          });
          setUserRole(response.data.role);
          console.log(isAuthenticated);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsAuthenticated(false);
      }
    };

    fetchUserRole();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <AuthContext.Provider value={{ userRole  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
