// src/components/AuthWrapper.js
import React from 'react';
import useAuthCheck from '../hooks/useAuthCheck';
import useTokenExpiration from '../hooks/useTokenExpiration';

const AuthWrapper = ({ children }) => {
  useAuthCheck(); // This hook will now run within the Router context
  useTokenExpiration();
  return children;
};

export default AuthWrapper;
