import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, ArrowLeft, CheckCircle, ShieldCheck, Truck, RotateCcw, Star, Bot, Sparkles, ThumbsUp, AlertTriangle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [aiReviewSummary, setAiReviewSummary] = useState(null);

  const [reviews, setReviews] = useState([
    { name: 'Sarah M.', rating: 5, comment: 'Exceptional quality! Exceeded my expectations. Fast delivery too.', date: '2 days ago' },
    { name: 'David K.', rating: 4, comment: 'Great product for the price. Works exactly as described.', date: '1 week ago' },
  ]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    api.getProductById(id)
      .then((data) => {
        setProduct(data);
        return Promise.all([api.getProducts(), api.aiSummarizeReviews(id)]);
      })
      .then(([allProducts, aiData]) => {
        setRelatedProducts(allProducts.filter((p) => p.id !== parseInt(id)).slice(0, 3));
        setAiReviewSummary(aiData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    setReviews([{ ...newReview, date: 'Just now' }, ...reviews]);
    setNewReview({ name: '', comment: '', rating: 5 });
  };

  if (loading) {
    return <div className="container" style={{ padding: '60px 0', color: '#94a3b8' }}>Loading product details & AI insights...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#f8fafc' }}>Product Not Found</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '16px', display: 'inline-block' }}>Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <Link to="/products" style={{ color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Tech Catalog
        </Link>

        {/* Main Product Card */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', padding: '32px', marginBottom: '30px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#0f172a', maxHeight: '420px' }}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
              {product.Category ? product.Category.name : 'Category'}
            </span>
            <h1 style={{ fontSize: '2.2rem', color: '#f8fafc', marginBottom: '10px' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#f59e0b' }}>
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
                <Star size={18} fill="#f59e0b" />
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>(4.9 stars • {reviews.length} customer reviews)</span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8', marginBottom: '16px' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </div>

            <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px', fontSize: '0.95rem' }}>
              {product.description}
            </p>

            {/* Feature Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', background: '#0f172a', padding: '14px', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                <Truck size={18} /> Free Express Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8' }}>
                <ShieldCheck size={18} /> 1-Year Official Warranty
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                <RotateCcw size={18} /> 30-Day Money Back
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                <CheckCircle size={18} /> In Stock ({product.stock} units)
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Qty:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-control"
                  style={{ width: '70px', padding: '8px 10px' }}
                />
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary"
                style={{ flex: 1, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* 🤖 AI Review Summary Banner */}
        {aiReviewSummary && (
          <div className="card" style={{ padding: '20px', marginBottom: '30px', background: 'linear-gradient(135deg, #1e1b4b, #0f172a)', border: '1px solid #4f46e5' }}>
            <div className="flex-between" style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot color="#818cf8" size={22} />
                <h3 style={{ color: '#f8fafc', fontSize: '1.05rem' }}>AI Sentiment & Review Synthesis</h3>
              </div>
              <span className="badge badge-green">{aiReviewSummary.sentimentScore}</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '14px', lineHeight: 1.5 }}>
              {aiReviewSummary.aiSummary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ color: '#34d399', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={14} /> Key Highlights
                </div>
                <ul style={{ paddingLeft: '16px', color: '#cbd5e1' }}>
                  {aiReviewSummary.pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> Considerations
                </div>
                <ul style={{ paddingLeft: '16px', color: '#cbd5e1' }}>
                  {aiReviewSummary.cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Product Specifications & User Reviews Tabs */}
        <div className="card" style={{ padding: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{ background: 'transparent', color: activeTab === 'description' ? '#38bdf8' : '#94a3b8', borderBottom: activeTab === 'description' ? '2px solid #38bdf8' : 'none', paddingBottom: '6px', fontWeight: 'bold' }}
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{ background: 'transparent', color: activeTab === 'reviews' ? '#38bdf8' : '#94a3b8', borderBottom: activeTab === 'reviews' ? '2px solid #38bdf8' : 'none', paddingBottom: '6px', fontWeight: 'bold' }}
            >
              Verified Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'description' ? (
            <div style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '0.95rem' }}>
              <p>{product.description}</p>
              <ul style={{ marginTop: '14px', paddingLeft: '20px' }}>
                <li>High quality hardware components engineered for maximum longevity</li>
                <li>Comprehensive quality assurance check passed</li>
                <li>Compatible with official ecosystems & accessories</li>
              </ul>
            </div>
          ) : (
            <div>
              {/* Write Review Form */}
              <form onSubmit={handleAddReview} style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <h4 style={{ color: '#f8fafc', marginBottom: '12px', fontSize: '0.95rem' }}>Add a Review</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    required
                  />
                  <select
                    className="form-control"
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Share your experience with this tech item..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                  style={{ marginBottom: '10px' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Submit Review
                </button>
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map((rev, idx) => (
                  <div key={idx} style={{ background: '#0f172a', padding: '14px', borderRadius: '8px' }}>
                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '0.9rem' }}>{rev.name}</span>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', color: '#f59e0b', marginBottom: '6px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" />
                      ))}
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '20px' }}>Similar Tech Devices</h2>
          <div className="grid-cards">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
