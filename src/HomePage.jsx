import React from 'react';
import './styles/styles.css'; // подключаем CSS аналогично

function HomePage() {
  return (
    <div className="home-page">
      <header>
        <div className="header-container">
          <div className="nav-buttons">
            <a href="/login">Войти</a>
            <a href="/register">Зарегистрироваться</a>
          </div>
        </div>
      </header>
      <main>
        <div className="container">
          <h1>Управляйте своим книжным магазином легко и эффективно!</h1>
          <p>Система для управления книгами и заказами. Всё, что нужно для вашего магазина, в одном месте.</p>
          <div className="benefits">
            <h2>Преимущества:</h2>
            <ul>
              <li>Простота в использовании.</li>
              <li>Высокая скорость работы.</li>
              <li>Автоматизация ключевых процессов.</li>
            </ul>
          </div>
          <div className="start-button">
            <a href="/dashboard" className="btn">Начать работу</a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
