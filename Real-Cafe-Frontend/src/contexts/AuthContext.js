// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import URL_API from '../apiconfig'; // Ensure correct path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    const checkAuth = async () => {
      try {
        await axios.get(`${URL_API}/check-auth`);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      await axios.post(`${URL_API}/login`, { username, password });
      setIsAuthenticated(true);
      navigate('/secret');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${URL_API}/logout`);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
