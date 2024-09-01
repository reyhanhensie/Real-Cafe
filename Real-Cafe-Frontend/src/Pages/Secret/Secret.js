// src/components/Secret.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL_API from '../../apiconfig'; // Import the API URL

const Secret = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch secret data when the component mounts
    const fetchSecret = async () => {
      try {
        const response = await axios.get(`${URL_API}/secret`, {
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          },
        });
        setMessage(response.data.message);
        setError('');
      } catch (err) {
        console.error('Error fetching secret data:', err.response ? err.response.data : err.message);
        setMessage('');
        if (err.response && err.response.status === 401) {
          setError('You are not authenticated.');
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    fetchSecret();
  }, []);

  return (
    <div>
      <h2>Secret Data</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Secret;
