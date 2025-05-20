import React, { useState, useEffect } from "react";
import Header from './Header'; 
import styles from './styles/inventory.module.css';
import './styles/header.css';
const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Добавить товар");
  const [editingProductId, setEditingProductId] = useState(null);

  // Данные формы
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    purchasePrice: "",
    sellingPrice: "",
    categoryId: "",
  });

  // Загрузка продуктов и категорий при загрузке компонента
  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => alert("Ошибка при загрузке продуктов"));

    fetch("/api/category")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => alert("Ошибка при загрузке категорий"));
  }, []);

  const openAddProductForm = () => {
    setFormData({
      name: "",
      description: "",
      purchasePrice: "",
      sellingPrice: "",
      categoryId: "",
    });
    setEditingProductId(null);
    setModalTitle("Добавить товар");
    setModalOpen(true);
  };

  const openEditProductForm = (productId) => {
    fetch(`/api/inventory/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((product) => {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          purchasePrice: product.purchasePrice || "",
          sellingPrice: product.sellingPrice || "",
          categoryId: product.category ? product.category.id : "",
        });
        setEditingProductId(productId);
        setModalTitle("Редактировать товар");
        setModalOpen(true);
      })
      .catch(() => alert("Ошибка при загрузке данных продукта"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      description: formData.description,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
    };

    const url = editingProductId
      ? `/api/inventory/${editingProductId}/edit`
      : "/api/inventory";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        alert(editingProductId ? "Продукт успешно обновлен!" : "Продукт успешно добавлен!");
        setModalOpen(false);
        // Перезагружаем список продуктов после успешного добавления/обновления
        return fetch("/api/inventory").then((res) => res.json());
      })
      .then(setProducts)
      .catch(() => alert("Ошибка при сохранении продукта. Попробуйте еще раз."));
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <Header />
    <div className={styles.container}>
      <h1 className={styles.title}>Управление товарами</h1>
        <button className={styles.button} onClick={openAddProductForm}>
          Добавить товар
        </button>

      <table className={styles.inventoryTable}>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Категория</th>
            <th>Количество</th>
            <th>Цена закупки</th>
            <th>Цена продажи</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products
            .slice() // чтобы не мутировать оригинальный массив
            .sort((a, b) => a.id - b.id)
            .map((product) => {
            const status =
              product.stockQuantity > 10
                ? "В наличии"
                : product.stockQuantity > 0
                ? "Мало на складе"
                : "Нет в наличии";

            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category ? product.category.name : ""}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.purchasePrice.toFixed(2)}</td>
                <td>{product.sellingPrice.toFixed(2)}</td>
                <td>{status}</td>
                <td>
                  <button
                      className={`${styles.button} ${styles.edit}`}
                      onClick={() => openEditProductForm(product.id)}
                    >
                      Редактировать
                    </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalOpen && (
        <div className={styles.modal} style={{ display: "flex" }}>
          <div className={styles.modalContent}>
              <span className={styles.close} onClick={closeModal}>
                &times;
              </span>
            <h2>{modalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Название</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <label htmlFor="categoryId">Категория:</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Не выбрано</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <label htmlFor="purchasePrice">Цена закупки</label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
              />

              <label htmlFor="sellingPrice">Цена продажи</label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
              />

              <button type="submit" className={styles.button}>
                  Сохранить
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Inventory;
