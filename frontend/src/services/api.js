// Singleton Pattern for API Communication Client

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  getToken() {
    return localStorage.getItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'API Request failed');
    }

    return result;
  }

  // Auth APIs
  login(email, password) {
    return this.request('/auth/login', 'POST', { email, password });
  }

  register(name, email, password, role) {
    return this.request('/auth/register', 'POST', { name, email, password, role });
  }

  getCurrentUser() {
    return this.request('/auth/me');
  }

  // Product APIs
  getProducts() {
    return this.request('/products');
  }

  getProductById(id) {
    return this.request(`/products/${id}`);
  }

  createProduct(productData) {
    return this.request('/products', 'POST', productData);
  }

  updateProduct(id, productData) {
    return this.request(`/products/${id}`, 'PUT', productData);
  }

  deleteProduct(id) {
    return this.request(`/products/${id}`, 'DELETE');
  }

  // Order APIs
  createOrder(orderData) {
    return this.request('/orders', 'POST', orderData);
  }

  getUserOrders() {
    return this.request('/orders/my-orders');
  }

  getAllOrders() {
    return this.request('/orders');
  }

  updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, 'PATCH', { status });
  }

  // Live Support Chat APIs
  getChatMessages() {
    return this.request('/chat');
  }

  sendChatMessage(text, senderName, senderRole) {
    return this.request('/chat', 'POST', { text, senderName, senderRole });
  }

  // 🤖 AI Features APIs
  aiChat(message) {
    return this.request('/ai/chat', 'POST', { message });
  }

  aiCompare(productIds) {
    return this.request('/ai/compare', 'POST', { productIds });
  }

  aiSummarizeReviews(productId) {
    return this.request(`/ai/reviews/${productId}`);
  }

  aiGenerateBundle(budget, usage) {
    return this.request('/ai/bundle', 'POST', { budget, usage });
  }
}

// Export Singleton Instance
export default new ApiService();
