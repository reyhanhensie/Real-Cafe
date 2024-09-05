// src/pages/Secret/Secret.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import usePrivilege from '../../hooks/PrivilegeHook'; // Import the custom hook

const Secret = () => {
  const { userRole, isAuthenticated, loading } = usePrivilege();
  const navigate = useNavigate();

  // Redirect if loading or not authenticated
  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Optionally handle role-based access
  if (userRole !== 'admin') {
    return <p>You do not have access to this page.</p>;
  }

  return (
    <div>
      <h2>Welcome, Admin</h2>
      <button onClick={() => navigate('/login')}>Logout</button>
    </div>
  );
};

export default Secret;
