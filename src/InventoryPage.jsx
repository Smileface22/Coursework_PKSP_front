import React, { useState, useEffect } from 'react';
import Header from './Header';
import styles from './styles/orders.module.css';

import './styles/header.css';

const OrdersManagement = () => {
  // Состояния компонента
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1, price: 0 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const API_URL = process.env.REACT_APP_API_URL;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchOrders();
  }, []);

  // Функция загрузки заказов и продуктов из API
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      console.log(data.orders );
      setOrders(data.orders || []);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Получение деталей конкретного заказа
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`);
      const data = await response.json();
      setSelectedOrder(data);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Обновление статуса заказа
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStatus),
      });

      if (response.ok) {
        fetchOrders(); // Обновляем список заказов
        alert('Статус заказа обновлен');
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  // Добавление товара в форму добавления заказа
  const handleAddProduct = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, price: 0 }]);
  };

  // Удаление товара из формы
  const handleRemoveProduct = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
    calculateTotal(newItems);
  };

  // Изменение выбранного товара
  const handleProductChange = (index, productId) => {
    const newItems = [...orderItems];
    const selectedProduct = products.find(p => p.id === Number(productId));

    newItems[index] = {
      ...newItems[index],
      productId,
      price: selectedProduct ? selectedProduct.purchasePrice : 0,
    };

    setOrderItems(newItems);
    calculateTotal(newItems);
  };

  // Изменение количества товара
  const handleQuantityChange = (index, quantity) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      quantity: parseInt(quantity) || 0,
    };

    setOrderItems(newItems);
    calculateTotal(newItems);
  };

  // Подсчёт общей суммы
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  // Отправка нового заказа на сервер
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      // Подготовка данных для отправки — по твоему Java-контроллеру он ожидает параметры productIds и quantities, а totalAmount.
      const productIds = orderItems
        .filter(item => item.productId)
        .map(item => Number(item.productId));
      const quantities = orderItems
        .filter(item => item.productId)
        .map(item => item.quantity);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          productIds: productIds.join(','), // возможно нужно будет настроить backend для корректного парсинга
          quantities: quantities.join(','),
          totalAmount: totalAmount.toString(),
        }),
      });

      if (response.ok) {
        alert('Заказ успешно создан');
        setShowAddOrderModal(false);
        setOrderItems([{ productId: '', quantity: 1, price: 0 }]);
        setTotalAmount(0);
        fetchOrders(); // Обновляем список заказов
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа');
    }
  };

    return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Управление заказами</h1>
        <button className={styles.button} onClick={() => setShowAddOrderModal(true)}>
          Добавить заказ
        </button>

        {/* Список заказов */}
        <section className={styles.ordersSection}>
          <h2>Список заказов</h2>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Дата заказа</th>
                <th>Статус</th>
                <th>Общая сумма</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders
                  .slice()
                  .sort((a, b) => a.id - b.id)
                  .map(order => (
                <tr key={order.id}>
                  <td>{order.orderDate}</td>
                  <td>{order.status}</td>
                  <td>{(order.totalAmount ?? 0).toLocaleString()} р.</td>
                  <td>
                    <button
                      className={`${styles.button} ${styles.details}`}
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      Просмотреть
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      <option value="Новый">Новый</option>
                      <option value="В процессе">В процессе</option>
                      <option value="Выполнен">Выполнен</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Детали заказа */}
        {showOrderDetails && selectedOrder && (
          <section className={styles.orderDetailsSection}>
            <h2>Детали заказа</h2>
            <table className={styles.orderDetailsTable}>
              <thead>
                <tr>
                  <th>Название товара</th>
                  <th>Количество</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price} р.</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              className={`${styles.button} ${styles.closeButton}`}
              onClick={() => setShowOrderDetails(false)}
            >
              Закрыть
            </button>
          </section>
        )}

        {/* Модальное окно добавления заказа */}
        <div className={`${styles.modal} ${showAddOrderModal ? styles.show : ''}`}>
          <div className={styles.modalContent}>
            <span 
              className={styles.closeIcon} 
              onClick={() => setShowAddOrderModal(false)}
            >
              &times;
            </span>
            <h2>Добавить заказ</h2>
            <form onSubmit={handleSubmitOrder} className={styles.form}>
              <label>Товары</label>
              <div className={styles.productList}>
                {orderItems.map((item, index) => (
                  <div key={index} className={styles.productItem}>
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className={styles.productSelect}
                      required
                    >
                      <option value="" disabled>Выберите товар</option>
                      {products.map(product => (
                        <option
                          key={product.id}
                          value={product.id}
                          data-price={product.purchasePrice}
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className={styles.productQuantity}
                      placeholder="Количество"
                      min="1"
                      required
                    />
                    <span className={styles.productPrice}>
                      Цена: {item.price * item.quantity} р.
                    </span>
                    {orderItems.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeProduct}
                        onClick={() => handleRemoveProduct(index)}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={`${styles.button} ${styles.addProductButton}`}
                onClick={handleAddProduct}
              >
                Добавить товар
              </button>

              <div className={styles.totalSum}>
                Общая сумма: {totalAmount.toLocaleString()} р.
              </div>

              <button 
                type="submit" 
                className={`${styles.button} ${styles.saveButton}`}
              >
                Заказать
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default OrdersManagement;
