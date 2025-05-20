import React, { useState } from 'react';
import styles from './styles/login.module.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = '/login';
      } else {
        const data = await response.json();
        setError(data.message || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError('Ошибка сети');
    }
  };

  return (
    <div className={styles.loginPage}>
      <main className={styles.main}>
        <div className={styles.container}>
          <h2>Регистрация</h2>
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
            <button type="submit">Зарегистрироваться</button>
          </form>
          {error && <div className={styles.error}><p>{error}</p></div>}
          <div className={styles.accountLink}>
            <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;
