import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CatalogPage.css';

export function CatalogPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setItems([
        { id: '1', title: 'Camiseta Táctica', price: 15, type: 'product', category: 'Ropa' },
        { id: '2', title: 'Diseño Web', price: 100, type: 'service', category: 'Servicios' },
      ]);
      setLoading(false);
    }, 1000);
  }, [userId]);

  return (
    <div className="catalog-container">
      <header className="catalog-hud">
        <button onClick={() => navigate(-1)} className="btn-icon">[ &lt; ]</button>
        <h1>[ CATALOG: {userId} ]</h1>
        <button className="btn-icon">[ + ]</button>
      </header>

      <div className="categories-bar">
        {['TODOS', 'ROPA', 'SERVICIOS', 'ELECTRÓNICA'].map(cat => (
          <button key={cat} className="cat-btn">{cat}</button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">CARGANDO CATÁLOGO...</p>
      ) : (
        <div className="catalog-grid">
          {items.map(item => (
            <div key={item.id} className="catalog-card">
              <div className="card-image-placeholder">NO_IMG</div>
              <div className="card-info">
                <h3>{item.title}</h3>
                <p className="price">${item.price} USD</p>
                <span className="type">[{item.type.toUpperCase()}]</span>
              </div>
              <button className="buy-btn" onClick={() => navigate('/checkout', { state: { amount: item.price, concept: item.title } })}>
                [ COMPRAR ]
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
