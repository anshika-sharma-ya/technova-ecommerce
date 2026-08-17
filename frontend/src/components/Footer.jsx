import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', borderTop: '1px solid #1e293b', padding: '30px 0', marginTop: 'auto' }}>
      <div className="container flex-between" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '6px' }}>NovaStore E-Commerce</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Full-Stack React Internship Final Project — REST API, WebSockets, PostgreSQL & Design Patterns
          </p>
        </div>
        <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'right' }}>
          <p>© 2026 Intern Project Submission. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
