import { useEffect, useState } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = загрузка
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/api/me`, {
      method: 'GET',
      credentials: 'include', // главное: включить куки
    })
      .then(res => {
        setIsAuthenticated(res.ok); // если 200 — авторизован
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  return isAuthenticated;
}

export default useAuth;
