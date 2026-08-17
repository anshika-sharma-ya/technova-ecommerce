import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Grid, List, Heart, RotateCcw } from 'lucide-react';

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    api.getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const categories = ['All', ...new Set(products.map((p) => (p.Category ? p.Category.name : 'Uncategorized')))];

  // Filtering Logic
  let filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (p.Category && p.Category.name === selectedCategory);
    const matchesPrice = p.price <= maxPrice;
    const matchesStock = !inStockOnly || p.stock > 0;
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Sorting Logic
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-az') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setMaxPrice(200000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', color: '#f8fafc', marginBottom: '4px' }}>Tech Catalog</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Showing {filtered.length} of {products.length} flagship gadgets
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '4px', display: 'flex' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{ background: viewMode === 'grid' ? '#4f46e5' : 'transparent', color: 'white', padding: '6px 10px', borderRadius: '6px' }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{ background: viewMode === 'list' ? '#4f46e5' : 'transparent', color: 'white', padding: '6px 10px', borderRadius: '6px' }}
              >
                <List size={16} />
              </button>
            </div>

            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '180px', height: '38px', fontSize: '0.85rem' }}
            >
              <option value="featured">Featured Gadgets</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
          {/* Sidebar Advanced Filters */}
          <aside className="card" style={{ padding: '20px', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <div className="flex-between" style={{ marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SlidersHorizontal size={18} color="#38bdf8" /> Tech Filters
              </h3>
              <button onClick={resetFilters} style={{ background: 'transparent', color: '#64748b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="form-group">
              <label>Search Keyword</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter gadgets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Max Price Slider (₹ INR) */}
            <div className="form-group">
              <div className="flex-between" style={{ marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Max Budget (₹)</label>
                <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem' }}>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="200000"
                step="2000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#4f46e5' }}
              />
            </div>

            {/* In Stock Checkbox */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In Stock Devices Only
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading tech gadgets...</p>
            ) : filtered.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <p style={{ color: '#94a3b8', marginBottom: '14px' }}>No tech products match your filters.</p>
                <button onClick={resetFilters} className="btn-secondary">Clear All Filters</button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid-cards">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.map((product) => (
                  <div key={product.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '16px' }}>
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <span className="badge badge-primary" style={{ marginBottom: '6px', display: 'inline-block' }}>
                        {product.Category ? product.Category.name : 'Tech Device'}
                      </span>
                      <h4 style={{ color: '#f8fafc', fontSize: '1.1rem', marginBottom: '6px' }}>{product.name}</h4>
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{product.description}</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '120px' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Heart size={14} color={wishlist.includes(product.id) ? '#ef4444' : '#94a3b8'} fill={wishlist.includes(product.id) ? '#ef4444' : 'none'} />
                        Wishlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
