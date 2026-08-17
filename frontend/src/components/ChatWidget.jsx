import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, X, Send } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const { socket } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch recent chat history
    api.getChatMessages().then((data) => setMessages(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderName = user ? user.name : 'Customer';
    const senderRole = user ? user.role : 'customer';

    if (socket) {
      socket.emit('send_message', {
        senderName,
        senderRole,
        text: inputText,
      });
    } else {
      api.sendChatMessage(inputText, senderName, senderRole).then((msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    setInputText('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{
            borderRadius: '50%',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
          }}
        >
          <MessageSquare size={26} />
        </button>
      ) : (
        <div
          className="card animate-fade-in"
          style={{
            width: '340px',
            height: '460px',
            display: 'flex',
            flexDirection: 'column',
            padding: '0',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex-between" style={{ background: '#1e293b', padding: '14px 18px', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
              <h4 style={{ fontSize: '0.95rem', color: '#f8fafc' }}>Live Support Chat</h4>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a' }}>
            {messages.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
                No messages yet. Ask our team anything!
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.senderRole === 'admin' ? 'flex-start' : 'flex-end',
                    maxWidth: '80%',
                    background: msg.senderRole === 'admin' ? '#334155' : '#4f46e5',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '2px' }}>
                    {msg.senderName} ({msg.senderRole})
                  </div>
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '10px', background: '#1e293b', display: 'flex', gap: '8px', borderTop: '1px solid #334155' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px', borderRadius: '8px' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
