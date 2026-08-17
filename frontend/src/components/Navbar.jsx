import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AiAssistantModal, AiBundleModal } from './AiModals';
import { ShoppingBag, User, LogOut, LayoutDashboard, PackageCheck, Search, Cpu, Bot, Sparkles, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  // AI Modal States
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiBundleOpen, setIsAiBundleOpen] = useState(false);

  // Light / Dark Theme State (Persisted in localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 900, background: 'var(--nav-bg)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--card-border)' }}>
      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', padding: '6px 0', fontSize: '0.8rem', textAlign: 'center', color: '#ffffff', fontWeight: '500' }}>
        ⚡ Tech Super Sale! Use promo code <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>INTERN2026</span> for 15% OFF! Free Shipping across India.
      </div>

      <nav className="container flex-between" style={{ padding: '14px 20px', gap: '16px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px' }}>
          <div style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', padding: '8px', borderRadius: '10px', display: 'flex', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            <Cpu color="#ffffff" size={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: '800', background: 'linear-gradient(90deg, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TechNova
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>AI-POWERED PLATFORM</span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <form onSubmit={handleNavSearch} style={{ flex: 1, maxWidth: '340px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search laptops, smartphones, gaming..."
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
            style={{ paddingLeft: '38px', paddingRight: '12px', fontSize: '0.85rem', height: '38px' }}
          />
        </form>

        {/* Navigation Links, Buttons & Theme Slider Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/" style={{ color: 'var(--text-main)', fontWeight: '500', fontSize: '0.9rem' }}>Home</Link>
          <Link to="/products" style={{ color: 'var(--text-main)', fontWeight: '500', fontSize: '0.9rem' }}>Catalog</Link>

          {/* 🤖 AI Advisor Launch Button */}
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #4f46e5, #c084fc)' }}
          >
            <Bot size={16} /> AI Advisor
          </button>

          {/* ⚡ AI Setup Generator Button */}
          <button
            onClick={() => setIsAiBundleOpen(true)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', borderColor: '#06b6d4', color: 'var(--text-main)' }}
          >
            <Sparkles size={14} color="#06b6d4" /> AI Setup
          </button>

          {user && (
            <Link to="/my-orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontSize: '0.85rem' }}>
              <PackageCheck size={16} color="#34d399" /> Orders
            </Link>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: '600', fontSize: '0.85rem' }}>
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '6px', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            <ShoppingBag size={20} color="#38bdf8" />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#4f46e5',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Auth Buttons / Profile Info */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--card-border)', paddingLeft: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                Hi, <strong>{user.name.split(' ')[0]}</strong>
              </span>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={14} /> Exit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Login</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Register</Link>
            </div>
          )}

          {/* ☀️ / 🌙 THEME TOGGLE SLIDER (Positioned to the immediate right of Register) */}
          <div
            onClick={toggleTheme}
            className="theme-switch"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <Moon size={12} color="#94a3b8" style={{ marginLeft: '4px' }} />
            <Sun size={12} color="#f59e0b" style={{ marginRight: '4px' }} />
            <div className="theme-switch-slider">
              {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
            </div>
          </div>
        </div>
      </nav>

      {/* AI Modals */}
      <AiAssistantModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <AiBundleModal isOpen={isAiBundleOpen} onClose={() => setIsAiBundleOpen(false)} />
    </header>
  );
}
