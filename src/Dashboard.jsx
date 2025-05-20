import React, { useEffect, useState } from 'react';
import './styles/dashboard.css';
import Header from './Header';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    currentStock: 0,
    lowStock: 0,
    completedOrders: 0,
    processingOrders: 0,
    ordersToday: 0,
    ordersThisMonth: 0,
  });
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Объединяем загрузку данных в один async вызов
    async function fetchMetrics() {
      try {
        // Запрос текущих запасов
        const stockResponse = await fetch(`${API_URL}/api/metrics/current-stock`);
        const stockData = await stockResponse.json();

        // Запрос статуса заказов
        const statusResponse = await fetch(`${API_URL}/api/metrics/order-status`);
        const statusData = await statusResponse.json();

        // Запрос количества заказов
        const countResponse = await fetch(`${API_URL}/api/metrics/order-count`);
        const countData = await countResponse.json();

        // Обновляем состояние единой метрики
        setMetrics({
          currentStock: stockData.totalStock || 0,
          lowStock: stockData.lowStockCount || 0,
          completedOrders: statusData.completed || 0,
          processingOrders: statusData.processing || 0,
          ordersToday: countData.ordersToday || 0,
          ordersThisMonth: countData.ordersThisMonth || 0,
        });
      } catch (error) {
        console.error('Ошибка при загрузке метрик:', error);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <div className="metrics">
          <div className="card">
            <h2>Текущие запасы</h2>
            <p id="current-stock">{metrics.currentStock} товаров</p>
            <p id="low-stock" style={{ color: 'red' }}>
              {metrics.lowStock} товаров с низким уровнем
            </p>
          </div>
          <div className="card">
            <h2>Статус заказов</h2>
            <p id="completed-orders">Выполнено: {metrics.completedOrders}</p>
            <p id="processing-orders">В процессе: {metrics.processingOrders}</p>
          </div>
          <div className="card">
            <h2>Количество заказов</h2>
            <p id="orders-today">Заказы за сегодня: {metrics.ordersToday}</p>
            <p id="orders-this-month">Заказы за месяц: {metrics.ordersThisMonth}</p>
          </div>
        </div>

        <div className="actions">
          <div className="card">
            <h2>Управление заказами</h2>
            <a href="/orders" className="button">Перейти</a>
          </div>
          <div className="card">
            <h2>Управление товарами</h2>
            <a href="/inventory" className="button">Перейти</a>
          </div>
          <div className="card">
            <h2>Управление категориями</h2>
            <a href="/category" className="button">Перейти</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
