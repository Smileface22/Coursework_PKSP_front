import { useEffect, useState } from 'react';

function useAuth() {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    error: null
  });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
        } else if (response.status === 401) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            error: null
          });
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          error: error.message
        });
      }
    };

    checkAuth();
  }, [API_URL]);

  return authState;
}

export default useAuth;