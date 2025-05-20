import React, { useState } from 'react';
import styles from './styles/login.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '/dashboard';
      } else {
        const data = await response.json();
        setError(data.message || 'Ошибка при входе');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  return (
    <div className={styles.loginPage}>
      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Вход</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Почта"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Войти</button>
          </form>
          {error && <div className={styles.error}><p>{error}</p></div>}
          <div className={styles.accountLink}>
            <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
