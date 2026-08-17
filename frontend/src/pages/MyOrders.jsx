import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Package, Clock, Truck, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUserOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={14} /> Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Truck size={14} /> Shipped</span>;
      case 'Processing':
        return <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Processing</span>;
      default:
        return <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> {status}</span>;
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '60px 0', color: 'var(--text-muted)' }}>Loading order history...</div>;
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '8px' }}>My Order History</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Track your purchases and view order details.</p>

        {orders.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>No Orders Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn-primary">Browse Shop</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{ padding: '24px' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Order #{order.id}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '12px' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {getStatusBadge(order.status)}
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#38bdf8' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Items list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {order.OrderItems && order.OrderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--card-inner-bg)', padding: '10px 14px', borderRadius: '8px' }}>
                      {item.Product && (
                        <img
                          src={item.Product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
                          alt={item.Product.name}
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: '500', fontSize: '0.95rem' }}>
                          {item.Product ? item.Product.name : `Product #${item.productId}`}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem' }}>
                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
                  <span>Shipping Address: {order.shippingAddress}</span>
                  <span>Payment Strategy: {order.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
