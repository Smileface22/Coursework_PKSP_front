import React from 'react';
import { useNavigate } from 'react-router-dom'; // если используешь react-router

const Header = () => {
  const navigate = useNavigate();
   const API_URL = process.env.REACT_APP_API_URL;
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: 'POST',           // POST-запрос на logout
        credentials: 'include',   // чтобы отправлялись куки сессии
      });
      if (response.ok) {
        // Очистить локальное состояние, например localStorage
        localStorage.removeItem('isAuthenticated');

        // Перейти на страницу логина
        navigate('/');
      } else {
        console.error('Ошибка при выходе');
      }
    } catch (error) {
      console.error('Ошибка сети при выходе', error);
    }
  };

  return (
    <header className="header">
      <div className="logo">Мой Магазин</div>
      <div className="nav-buttons">
        <a href="/dashboard">Панель управления</a>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    </header>
  );
};

export default Header;
