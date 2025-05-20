import React, { useState, useEffect } from 'react';
import styles from './styles/category.module.css';
import headerStyles from './styles/header.module.css';
import Header from './Header';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({ id: null, name: '', description: '' });

  useEffect(() => {
    fetch('/api/category')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки категорий');
        return res.json();
      })
      .then(data => setCategories(data))
      .catch(err => alert(err.message));
  }, []);

  function openAddCategoryForm() {
    setModalTitle('Добавить категорию');
    setFormData({ id: null, name: '', description: '' });
    setModalOpen(true);
  }

  function editCategory(id) {
    fetch('/api/category/' + id)
      .then(res => {
        if (!res.ok) throw new Error('Не удалось загрузить данные категории');
        return res.json();
      })
      .then(data => {
        setModalTitle('Редактировать категорию');
        setFormData({ id, name: data.name, description: data.description });
        setModalOpen(true);
      })
      .catch(err => alert(err.message));
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Название категории обязательно');
      return;
    }

    const url = formData.id === null ? '/api/category' : `/api/category/${formData.id}/edit`;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name, description: formData.description }),
    })
      .then(res => {
        if (res.ok) return res.text();
        return res.text().then(text => { throw new Error(text); });
      })
      .then(msg => {
        alert(msg || (formData.id === null ? 'Категория добавлена!' : 'Категория обновлена!'));
        closeModal();
        return fetch('/api/category').then(res => res.json());
      })
      .then(data => setCategories(data))
      .catch(err => alert('Ошибка: ' + err.message));
  }

  function deleteCategory(id) {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    fetch('/api/category/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (res.ok) {
          alert('Категория успешно удалена!');
          setCategories(prev => prev.filter(cat => cat.id !== id));
        } else {
          alert('Ошибка при удалении категории. Пожалуйста, попробуйте еще раз.');
        }
      })
      .catch(err => {
        alert('Произошла ошибка при удалении категории.');
        console.error(err);
      });
  }

  return (
    <div>
      <Header className={headerStyles.header} />
      <div className={styles.container}>
        <h1 className={styles.title}>Управление категориями</h1>
        <button className={styles.button} onClick={openAddCategoryForm}>Добавить категорию</button>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .slice()
              .sort((a, b) => a.id - b.id)
              .map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <button className={`${styles.button} ${styles.edit}`} onClick={() => editCategory(cat.id)}>Редактировать</button>
                    <button className={`${styles.button} ${styles.delete}`} onClick={() => deleteCategory(cat.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {modalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.close} onClick={closeModal}>&times;</span>
              <h2>{modalTitle}</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Название категории</label>
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
                  value={formData.description}
                  onChange={handleChange}
                />
                <button type="submit" className={styles.button}>Сохранить</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
