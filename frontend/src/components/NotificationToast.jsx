import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, dismissNotification } = useSocket();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {notifications.map((notif, idx) => (
        <div
          key={idx}
          className="card animate-fade-in flex-between"
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderColor: '#4f46e5',
            padding: '12px 16px',
            minWidth: '280px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '6px', borderRadius: '6px' }}>
              <Bell color="#818cf8" size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#818cf8' }}>
                {notif.event === 'ORDER_CREATED' ? '🛒 New Order Created' : '⚡ Order Status Updated'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {notif.payload.user ? `${notif.payload.user} placed order #${notif.payload.orderId}` : `Order #${notif.payload.orderId} status: ${notif.payload.status}`}
              </div>
            </div>
          </div>
          <button onClick={() => dismissNotification(idx)} style={{ background: 'transparent', color: '#64748b', marginLeft: '10px' }}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
