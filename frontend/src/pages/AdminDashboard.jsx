import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusCircle, Package, ShoppingCart, RefreshCw, Trash2, ShieldCheck, Cpu } from 'lucide-react';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: 10,
    categoryId: 1,
    imageUrl: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, orderData] = await Promise.all([api.getProducts(), api.getAllOrders()]);
      setProducts(prodData);
      setOrders(orderData);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.createProduct(newProduct);
      setMessage('Tech product added successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock: 10,
        categoryId: 1,
        imageUrl: '',
      });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      fetchData();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    }
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="flex-between" style={{ marginBottom: '30px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck color="var(--accent-gold)" size={28} />
              <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Tech Store Admin Panel</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Protected by Role-Based Access Control (RBAC middleware)
            </p>
          </div>

          <button onClick={fetchData} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </div>

        {message && <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: 'var(--accent-green)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{message}</div>}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: 'var(--accent-red)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Add Product Form */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={20} color="#38bdf8" /> Add Tech Device
            </h3>

            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Gadget Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tech Specs & Description</label>
                <textarea
                  rows="2"
                  className="form-control"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Price (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    className="form-control"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tech Category</label>
                <select
                  className="form-control"
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: parseInt(e.target.value) })}
                >
                  <option value={1}>1 - Laptops & PCs</option>
                  <option value={2}>2 - Smartphones & Tablets</option>
                  <option value={3}>3 - Audio & Wearables</option>
                  <option value={4}>4 - Gaming & Accessories</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>
                Add Device to Inventory
              </button>
            </form>
          </div>

          {/* Manage Orders & Status Broadcast */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="var(--accent-gold)" /> Tech Orders Management
            </h3>

            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                {orders.map((ord) => (
                  <div key={ord.id} style={{ background: 'var(--card-inner-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Order #{ord.id}</span>
                      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>
                      User: {ord.User ? ord.User.name : 'Customer'} ({ord.paymentMethod})
                    </div>

                    <div className="flex-between">
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Observer:</span>
                      <select
                        className="form-control"
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{ width: '130px', padding: '4px 8px', fontSize: '0.75rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Existing Inventory Table */}
        <div className="card" style={{ marginTop: '30px', padding: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="var(--accent-green)" /> Current Tech Inventory
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Device Name</th>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Price (₹)</th>
                  <th style={{ padding: '10px' }}>Stock</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '10px' }}>#{p.id}</td>
                    <td style={{ padding: '10px', color: 'var(--text-main)', fontWeight: '500' }}>{p.name}</td>
                    <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{p.Category ? p.Category.name : 'N/A'}</td>
                    <td style={{ padding: '10px', color: '#38bdf8', fontWeight: 'bold' }}>₹{p.price.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '10px' }}>{p.stock}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'transparent', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
