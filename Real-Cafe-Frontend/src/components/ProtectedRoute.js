// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');

  // Simple token check, you might want to validate it further
  return token ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
