import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Explore our tech catalog and add your favorite gadgets.</p>
          <Link to="/products" className="btn-primary">Browse Tech Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '24px' }}>Shopping Cart</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.id} className="card flex-between" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{item.name}</h4>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="form-control"
                    style={{ width: '60px', padding: '6px' }}
                  />
                  <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', color: '#ef4444' }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="btn-secondary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary Box */}
          <div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px' }}>Order Summary</h3>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex-between" style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span>Express Delivery</span>
                <span style={{ color: 'var(--accent-green)' }}>FREE</span>
              </div>
              <hr style={{ borderColor: 'var(--card-border)', margin: '16px 0' }} />
              <div className="flex-between" style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>
                <span>Total Amount</span>
                <span style={{ color: '#38bdf8' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
