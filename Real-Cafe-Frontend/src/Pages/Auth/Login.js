// src/pages/Auth/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import URL_API from '../../apiconfig'; // Updated import path
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Get the CSRF token from the meta tag after the component mounts
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    setCsrfToken(token || '');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL_API}/login`, {
        username,
        password
      }, {
        headers: {
          'X-CSRF-TOKEN': csrfToken,
          'Content-Type': 'application/json' // Ensure content type is set to JSON
        }
      });
    const token = response.data.token;
    const sessionDurationMinutes = 180; // Session duration
    const expirationTime = new Date().getTime() + sessionDurationMinutes * 60 * 1000; // in milliseconds

    // Save token and expiration time
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', expirationTime);
      setMessage(response.data.message);
      setError('');
      // Navigate to the /secret route after successful login
      navigate('/secret');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
