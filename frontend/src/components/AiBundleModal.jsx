import React, { useState } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Sparkles, X, ShoppingBag, CheckCircle, Package } from 'lucide-react';

export default function AiBundleModal({ isOpen, onClose }) {
  const [budget, setBudget] = useState(100000);
  const [usage, setUsage] = useState('coding');
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.aiGenerateBundle(budget, usage);
      setBundle(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (bundle && bundle.products) {
      bundle.products.forEach((p) => addToCart(p));
      onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', border: '1px solid #06b6d4', boxShadow: '0 20px 50px rgba(6, 182, 212, 0.3)' }}>
        <div className="flex-between" style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Budget Setup Generator <Sparkles color="#38bdf8" size={18} />
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Maximum Budget (₹)</label>
            <input
              type="number"
              step="5000"
              className="form-control"
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Primary Use Case</label>
            <select className="form-control" value={usage} onChange={(e) => setUsage(e.target.value)}>
              <option value="coding">Software Development & Work</option>
              <option value="gaming">High-FPS Gaming Setup</option>
              <option value="general">Daily Lifestyle & Audio</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ gridColumn: 'span 2', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'AI Assembling Tech Bundle...' : '⚡ Generate AI Setup Package'}
          </button>
        </form>

        {/* Bundle Results */}
        {bundle && (
          <div style={{ background: '#0f172a', padding: '18px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div className="flex-between" style={{ marginBottom: '10px' }}>
              <h4 style={{ color: '#f8fafc', fontSize: '1.05rem' }}>{bundle.bundleName}</h4>
              <span className="badge badge-green">Save ₹{bundle.savings.toLocaleString('en-IN')}</span>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5 }}>
              {bundle.aiReasoning}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {bundle.products.map((prod) => (
                <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1e293b', padding: '10px', borderRadius: '8px' }}>
                  <img src={prod.imageUrl} alt={prod.name} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#f8fafc', fontWeight: '500', fontSize: '0.85rem' }}>{prod.name}</div>
                    <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.8rem' }}>₹{prod.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-between" style={{ borderTop: '1px solid #334155', paddingTop: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bundle Total Cost</div>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' }}>₹{bundle.totalCost.toLocaleString('en-IN')}</div>
              </div>

              <button onClick={handleAddAllToCart} className="btn-primary" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShoppingBag size={16} /> Add All {bundle.products.length} Items to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
