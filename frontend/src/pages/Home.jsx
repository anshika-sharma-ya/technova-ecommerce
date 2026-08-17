import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ShieldCheck, Zap, Truck, Headphones, Layers, Percent, Laptop, Smartphone, Gamepad2, Award } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Banner with Theme-aware background */}
      <section style={{
        background: 'var(--hero-bg)',
        padding: '80px 0',
        borderBottom: '1px solid var(--card-border)',
      }}>
        <div className="container flex-between" style={{ gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '18px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
              <Award size={16} /> Full-Stack React & Node Internship Final Project
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '18px', color: 'var(--hero-title-color)' }}>
              TechNova — Next-Gen Tech Store
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '30px', lineHeight: 1.6 }}>
              Discover flagship laptops, smartphones, wireless audio, and gaming gear.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '1rem' }}>
                Explore Tech Catalog <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                Create Account
              </Link>
            </div>
          </div>

          {/* Hero Feature Card with Theme-aware background & text */}
          <div style={{ flex: '0 0 360px', background: 'var(--hero-card-bg)', backdropFilter: 'blur(12px)', padding: '28px', borderRadius: '20px', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '1.15rem' }}>Design Patterns Architecture</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.2)', padding: '8px', borderRadius: '8px' }}>
                  <Zap color="#38bdf8" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Observer Pattern</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time WebSockets</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '8px', borderRadius: '8px' }}>
                  <ShieldCheck color="#34d399" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Auth & RBAC</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JWT Token & Role middleware</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '8px', borderRadius: '8px' }}>
                  <Truck color="#fbbf24" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Strategy Pattern</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI / Card / COD payments</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(192, 132, 252, 0.2)', padding: '8px', borderRadius: '8px' }}>
                  <Layers color="#c084fc" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Repository Pattern</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sequelize DB layer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section style={{ background: 'var(--banner-bg)', borderBottom: '1px solid var(--card-border)', padding: '24px 0' }}>
        <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.3)', padding: '12px', borderRadius: '12px' }}>
              <Percent color="#818cf8" size={28} />
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>Tech Fest Flash Discount</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Apply code <strong style={{ color: '#38bdf8' }}>INTERN2026</strong> at checkout for 15% instant discount</p>
            </div>
          </div>
          <Link to="/products" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            Shop Tech Sale
          </Link>
        </div>
      </section>

      {/* Tech Category Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '24px' }}>Explore Tech Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <Link to="/products?category=Laptops%20%26%20PCs" className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
              <Laptop size={36} color="#38bdf8" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>Laptops & PCs</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ultrabooks & Gaming Rigs</p>
            </Link>

            <Link to="/products?category=Smartphones%20%26%20Tablets" className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
              <Smartphone size={36} color="#34d399" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>Smartphones & Tablets</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Flagship Mobile Devices</p>
            </Link>

            <Link to="/products?category=Audio%20%26%20Wearables" className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
              <Headphones size={36} color="#c084fc" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>Audio & Wearables</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>ANC Headphones & Smartwatches</p>
            </Link>

            <Link to="/products?category=Gaming%20%26%20Accessories" className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--card-border)' }}>
              <Gamepad2 size={36} color="#fbbf24" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>Gaming & Accessories</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Mechanical Keyboards & Gear</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tech Products */}
      <section style={{ padding: '40px 0 60px 0' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Featured Tech Devices</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Top rated electronics</p>
            </div>
            <Link to="/products" className="btn-secondary" style={{ fontSize: '0.85rem' }}>View All Devices</Link>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading tech items...</p>
          ) : (
            <div className="grid-cards">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
