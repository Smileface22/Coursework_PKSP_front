import React, { useState, useEffect } from 'react';

function ProductModal({ productId, onClose, onSaved }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    categoryId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      setLoading(true);
      fetch(`/api/inventory/${productId}`)
        .then(res => {
          if (!res.ok) throw new Error('Ошибка загрузки данных продукта');
          return res.json();
        })
        .then(data => {
          setProduct({
            name: data.name || '',
            description: data.description || '',
            purchasePrice: data.purchasePrice || '',
            sellingPrice: data.sellingPrice || '',
            categoryId: data.category ? data.category.id : ''
          });
          setIsEditing(true);
        })
        .catch(err => {
          alert(err.message);
        })
        .finally(() => setLoading(false));
    } else {
      setProduct({
        name: '',
        description: '',
        purchasePrice: '',
        sellingPrice: '',
        categoryId: ''
      });
      setIsEditing(false);
    }
  }, [productId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      name: product.name,
      description: product.description,
      purchasePrice: parseFloat(product.purchasePrice) || 0,
      sellingPrice: parseFloat(product.sellingPrice) || 0,
      category: product.categoryId ? { id: parseInt(product.categoryId) } : null
    };

    const url = isEditing ? `/api/inventory/${productId}/edit` : '/api/inventory';
    const method = 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при сохранении продукта');
        alert(isEditing ? 'Продукт успешно обновлен!' : 'Продукт успешно добавлен!');
        onClose();
        onSaved();
      })
      .catch(err => {
        alert(err.message);
      });
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close" onClick={onClose}>&times;</button>
        <h2>{isEditing ? 'Редактировать товар' : 'Добавить товар'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Название:
            <input
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Описание:
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Цена закупки:
            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              value={product.purchasePrice}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Цена продажи:
            <input
              name="sellingPrice"
              type="number"
              step="0.01"
              value={product.sellingPrice}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Категория (ID):
            <input
              name="categoryId"
              type="number"
              value={product.categoryId}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="button save-button">
            {isEditing ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
