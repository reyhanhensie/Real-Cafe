// src/hooks/usePrivilege.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import URL_API from '../apiconfig';

const usePrivilege = () => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []); // This effect runs once when the component mounts

  return { userRole, isAuthenticated, loading };
};

export default usePrivilege;
