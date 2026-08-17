import React, { useState } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { Bot, Sparkles, X, Send, ShoppingCart, ArrowRight } from 'lucide-react';

export default function AiAssistantModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Nova AI, your intelligent tech shopping assistant. How can I help you find the perfect gadget today?',
      recommendations: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const messageText = textToSend || query;
    if (!messageText.trim()) return;

    // Add user message
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '640px', height: '620px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid #4f46e5', boxShadow: '0 20px 50px rgba(79, 70, 229, 0.3)' }}>
        {/* Header */}
        <div className="flex-between" style={{ background: 'linear-gradient(135deg, #1e1b4b, #1e293b)', padding: '16px 20px', borderBottom: '1px solid #334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', padding: '8px', borderRadius: '10px', display: 'flex' }}>
              <Bot color="#ffffff" size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Nova AI Tech Advisor <Sparkles size={16} color="#38bdf8" />
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Real-time NLP Spec Analysis & Recommendations</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#0f172a' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  background: msg.sender === 'user' ? '#4f46e5' : '#1e293b',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  fontSize: '0.9rem',
                  border: msg.sender === 'ai' ? '1px solid #334155' : 'none',
                  lineHeight: 1.5,
                }}
              >
                {msg.text}
              </div>

              {/* Recommended Product Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                  {msg.recommendations.map((prod) => (
                    <div key={prod.id} style={{ background: '#1e293b', padding: '12px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={prod.imageUrl} alt={prod.name} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '0.9rem' }}>{prod.name}</div>
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
            <div style={{ color: '#38bdf8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot className="animate-spin" size={16} /> Nova AI is analyzing hardware specs...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: '10px 16px', background: '#1e293b', borderTop: '1px solid #334155', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{ background: '#0f172a', color: '#94a3b8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              ⚡ {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ padding: '12px 16px', background: '#1e293b', display: 'flex', gap: '10px' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask Nova AI anything about laptops, audio, smartphones..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '10px 18px' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
