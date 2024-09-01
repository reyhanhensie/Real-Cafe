// src/pages/Secret/Secret.js

import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import URL_API from '../../apiconfig';

const Secret = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${URL_API}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      localStorage.removeItem('authToken');
      // Redirect to login or home page after logout
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <h2>Secret Data</h2>
      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Secret;
