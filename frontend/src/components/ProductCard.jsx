import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', background: 'var(--input-bg)' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
          {product.Category ? product.Category.name : 'Tech Item'}
        </span>
        <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: '700' }}>{product.name}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px', flex: 1, lineHeight: 1.5 }}>
          {product.description.length > 85 ? product.description.substring(0, 85) + '...' : product.description}
        </p>

        <div className="flex-between" style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/products/${product.id}`} className="btn-secondary" style={{ padding: '8px', display: 'flex' }}>
              <Eye size={18} />
            </Link>
            <button onClick={() => addToCart(product)} className="btn-primary" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingCart size={18} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
