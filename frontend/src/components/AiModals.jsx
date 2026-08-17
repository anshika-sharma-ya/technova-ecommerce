import React, { useState } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Bot, Sparkles, X, Send, ShoppingCart, ShoppingBag, Maximize2, Minimize2 } from 'lucide-react';

// 🤖 Nova AI Tech Shopping Advisor Modal Component
export function AiAssistantModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Nova AI, your intelligent tech shopping assistant. How can I help you find the perfect gadget today?',
      recommendations: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const messageText = textToSend || query;
    if (!messageText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: messageText }]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      const data = await api.aiChat(messageText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply,
          recommendations: data.recommendations || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered an issue analyzing your query. Please try asking again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Best laptop for coding under ₹1,00,000',
    'Recommend flagship smartphones',
    'Wireless ANC headphones for travel',
    'Budget gaming accessories',
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isFullScreen ? '0' : '20px',
      boxSizing: 'border-box'
    }}>
      <div className="card animate-fade-in" style={{
        width: isFullScreen ? '100vw' : '90%',
        maxWidth: isFullScreen ? '100vw' : '880px',
        height: isFullScreen ? '100vh' : '85vh',
        maxHeight: isFullScreen ? '100vh' : '720px',
        borderRadius: isFullScreen ? '0' : '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        border: isFullScreen ? 'none' : '1px solid var(--primary)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        background: 'var(--card-bg)',
        transition: 'all 0.25s ease'
      }}>
        {/* Modal Header */}
        <div className="flex-between" style={{ background: 'var(--card-inner-bg)', padding: '16px 24px', borderBottom: '1px solid var(--card-border)', flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <Bot color="#ffffff" size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Nova AI Tech Advisor <Sparkles size={18} color="#38bdf8" />
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Real-time Hardware Spec Analysis & Shopping Intelligence</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              style={{ background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
              title={isFullScreen ? "Restore View" : "Full Screen View"}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <button
              onClick={onClose}
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
            >
              <X size={18} /> Close
            </button>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div style={{ flex: '1 1 auto', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--background)' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: msg.sender === 'user' ? 'var(--primary)' : 'var(--card-bg)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  fontSize: '0.92rem',
                  border: msg.sender === 'ai' ? '1px solid var(--card-border)' : 'none',
                  lineHeight: 1.6,
                  boxShadow: 'var(--shadow)'
                }}
              >
                {msg.text}
              </div>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '6px' }}>
                  {msg.recommendations.map((prod) => (
                    <div key={prod.id} style={{ background: 'var(--card-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={prod.imageUrl} alt={prod.name} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.9rem' }}>{prod.name}</div>
                        <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 'bold' }}>₹{prod.price.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => addToCart(prod)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <ShoppingCart size={14} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ color: '#38bdf8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot className="animate-spin" size={18} /> Nova AI is analyzing hardware specs...
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div style={{ padding: '10px 20px', background: 'var(--card-inner-bg)', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '10px', overflowX: 'auto', flex: '0 0 auto' }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{ background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>

        {/* Input Form Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ padding: '16px 24px', background: 'var(--card-inner-bg)', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '12px', flex: '0 0 auto' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask Nova AI anything about laptops, audio, smartphones..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ fontSize: '0.95rem', padding: '12px 18px' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ⚡ AI Budget Setup Package Generator Modal Component
export function AiBundleModal({ isOpen, onClose }) {
  const [budget, setBudget] = useState(100000);
  const [usage, setUsage] = useState('coding');
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isFullScreen ? '0' : '20px',
      boxSizing: 'border-box'
    }}>
      <div className="card animate-fade-in" style={{
        width: isFullScreen ? '100vw' : '90%',
        maxWidth: isFullScreen ? '100vw' : '800px',
        height: isFullScreen ? '100vh' : '85vh',
        maxHeight: isFullScreen ? '100vh' : '720px',
        borderRadius: isFullScreen ? '0' : '16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        border: isFullScreen ? 'none' : '1px solid var(--secondary)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        background: 'var(--card-bg)',
        transition: 'all 0.25s ease'
      }}>
        {/* Modal Header */}
        <div className="flex-between" style={{ background: 'var(--card-inner-bg)', padding: '16px 24px', borderBottom: '1px solid var(--card-border)', flex: '0 0 auto' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Budget Setup Generator <Sparkles color="#38bdf8" size={18} />
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              style={{ background: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--card-border)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>

            <button
              onClick={onClose}
              style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
            >
              <X size={18} /> Close
            </button>
          </div>
        </div>

        {/* Form & Bundle Content */}
        <div style={{ flex: '1 1 auto', padding: '24px', overflowY: 'auto', background: 'var(--background)' }}>
          <form onSubmit={handleGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
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

            <button type="submit" disabled={loading} className="btn-primary" style={{ gridColumn: 'span 2', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'AI Assembling Tech Bundle...' : '⚡ Generate AI Setup Package'}
            </button>
          </form>

          {bundle && (
            <div style={{ background: 'var(--card-inner-bg)', padding: '20px', borderRadius: '14px', border: '1px solid var(--card-border)' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <h4 style={{ color: 'var(--text-main)', fontSize: '1.15rem' }}>{bundle.bundleName}</h4>
                <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>Save ₹{bundle.savings.toLocaleString('en-IN')}</span>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                {bundle.aiReasoning}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {bundle.products.map((prod) => (
                  <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                    <img src={prod.imageUrl} alt={prod.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--text-main)', fontWeight: '500', fontSize: '0.88rem' }}>{prod.name}</div>
                      <div style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem' }}>₹{prod.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-between" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bundle Total Cost</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>₹{bundle.totalCost.toLocaleString('en-IN')}</div>
                </div>

                <button onClick={handleAddAllToCart} className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} /> Add All {bundle.products.length} Items to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
