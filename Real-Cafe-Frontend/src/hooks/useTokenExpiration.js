// src/hooks/useTokenExpiration.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SESSION_LIFETIME = 60 * 60 * 1000; // 60 minutes in milliseconds

const useTokenExpiration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateTokenExpiration = () => {
      const tokenExpiration = new Date().getTime() + SESSION_LIFETIME;
      localStorage.setItem('tokenExpiration', tokenExpiration);
    };

    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      if (tokenExpiration && new Date().getTime() > tokenExpiration) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        navigate('/login');
      }
    };

    const handleUserActivity = () => {
      updateTokenExpiration();
    };

    // Update expiration timestamp on user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Initial check for token expiration
    checkTokenExpiration();

    // Check for token expiration periodically
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [navigate]);
};

export default useTokenExpiration;
