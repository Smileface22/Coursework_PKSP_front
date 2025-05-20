import { useEffect, useState } from 'react';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = загрузка

  useEffect(() => {
    fetch('/api/me', {
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
