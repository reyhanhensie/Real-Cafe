import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration && new Date().getTime() > tokenExpiration) {
      // Token has expired
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiration');
      navigate('/login'); // Redirect to login or handle session expiry
    }
  }, [navigate]);
};

export default useAuthCheck;
