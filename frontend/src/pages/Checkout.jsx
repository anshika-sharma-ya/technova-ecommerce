import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, DollarSign, CheckCircle2, QrCode } from 'lucide-react';

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('Flat 402, Tech Towers, Hitec City, Hyderabad, Telangana - 500081');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = await api.createOrder({
        items,
        shippingAddress,
        paymentMethod,
      });

      setSuccessOrder(orderData);
      clearCart();
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '540px', margin: '0 auto', padding: '40px' }}>
          <CheckCircle2 size={64} color="var(--accent-green)" style={{ marginBottom: '16px' }} />
          <h1 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Thank you for your purchase! Your order ID is <strong>#{successOrder.id}</strong>.
          </p>
          <div style={{ background: 'var(--card-inner-bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left', fontSize: '0.9rem' }}>
            <div style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Status: <strong>{successOrder.status}</strong></div>
            <div style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Payment Method: <strong>{successOrder.paymentMethod.toUpperCase()} (Strategy Pattern)</strong></div>
            <div style={{ color: 'var(--text-main)' }}>Total Paid: <strong>₹{successOrder.totalAmount.toLocaleString('en-IN')}</strong></div>
          </div>
          <button onClick={() => navigate('/products')} className="btn-primary">Continue Tech Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '24px' }}>Checkout</h1>

        {error && <div className="card" style={{ borderLeft: '4px solid #ef4444', color: '#f87171', marginBottom: '20px', padding: '12px' }}>{error}</div>}

        <form onSubmit={handleCheckout} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Shipping & Payment Strategy Details */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px' }}>1. Delivery Address</h3>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea
                rows="3"
                className="form-control"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: '24px 0 16px 0' }}>
              2. Payment Method Strategy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--card-inner-bg)', borderRadius: '8px', border: '1px solid var(--card-border)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <QrCode size={20} color="var(--accent-green)" />
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>UPI / GPay / PhonePe / Paytm</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Strategy Pattern Handler 1</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--card-inner-bg)', borderRadius: '8px', border: '1px solid var(--card-border)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <CreditCard size={20} color="#38bdf8" />
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Credit / Debit Card / NetBanking</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Strategy Pattern Handler 2</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--card-inner-bg)', borderRadius: '8px', border: '1px solid var(--card-border)', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <DollarSign size={20} color="var(--accent-gold)" />
                <div>
                  <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Cash on Delivery (COD)</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Strategy Pattern Handler 3</div>
                </div>
              </label>
            </div>
          </div>

          {/* Review Order Summary */}
          <div>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px' }}>Order Total</h3>
              <div className="flex-between" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8', marginBottom: '24px' }}>
                <span>Total Amount:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {loading ? 'Processing Payment...' : 'Confirm & Complete Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
