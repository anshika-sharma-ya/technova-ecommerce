import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('user@ecommerce.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = () => {
    setEmail('user@ecommerce.com');
    setPassword('user123');
  };

  const setDemoAdmin = () => {
    setEmail('admin@ecommerce.com');
    setPassword('admin123');
  };

  return (
    <div style={{ padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.2)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <LogIn color="#818cf8" size={24} />
            </div>
            <h2 style={{ color: '#f8fafc', fontSize: '1.6rem' }}>Sign In</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Welcome back to NovaStore</p>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155', textAlign: 'center' }}>
            <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '10px' }}>QUICK DEMO CREDENTIALS:</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={setDemoUser} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>Customer Demo (Aadya)</button>
              <button onClick={setDemoAdmin} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 10px', borderColor: '#fbbf24', color: '#fbbf24' }}>Admin Demo</button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#94a3b8' }}>
            Don't have an account? <Link to="/register" style={{ color: '#38bdf8' }}>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
