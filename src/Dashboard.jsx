import React, { useEffect, useState } from 'react';
import './styles/dashboard.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    currentStock: 0,
    lowStock: 0,
    completedOrders: 0,
    processingOrders: 0,
    ordersToday: 0,
    ordersThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Проверяем аутентификацию сначала
        const authCheck = await fetch(`${API_URL}/api/me`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (authCheck.status === 401) {
          navigate('/login');
          return;
        }

        if (!authCheck.ok) {
          throw new Error('Ошибка проверки авторизации');
        }

        // Параллельные запросы метрик
        const [stockRes, statusRes, countRes] = await Promise.all([
          fetch(`${API_URL}/api/metrics/current-stock`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_URL}/api/metrics/order-status`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_URL}/api/metrics/order-count`, {
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
        ]);

        // Проверка всех ответов
        if (!stockRes.ok || !statusRes.ok || !countRes.ok) {
          throw new Error('Один из запросов завершился ошибкой');
        }

        const [stockData, statusData, countData] = await Promise.all([
          stockRes.json(),
          statusRes.json(),
          countRes.json()
        ]);

        setMetrics({
          currentStock: stockData.totalStock || 0,
          lowStock: stockData.lowStockCount || 0,
          completedOrders: statusData.completed || 0,
          processingOrders: statusData.processing || 0,
          ordersToday: countData.ordersToday || 0,
          ordersThisMonth: countData.ordersThisMonth || 0,
        });
      } catch (error) {
        console.error('Ошибка:', error);
        setError(error.message);
        if (error.message.includes('401')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, navigate]);

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

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
