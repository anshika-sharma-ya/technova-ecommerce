const express = require('express');
const http = require('http');
const cors = require('cors');
const { syncDatabase } = require('./models');

// Controllers
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const chatController = require('./controllers/chatController');
const aiController = require('./controllers/aiController');

// Middleware
const authenticateToken = require('./middleware/authMiddleware');
const checkRole = require('./middleware/rbacMiddleware');

// WebSocket
const setupWebSocket = require('./websocket/socketServer');

const app = express();
const server = http.createServer(app);

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize WebSockets
setupWebSocket(server);

// --- API ROUTES ---

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'E-Commerce REST API is running smoothly' });
});

// Authentication Routes
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.get('/api/auth/me', authenticateToken, (req, res) => authController.getCurrentUser(req, res));

// Product Catalog Routes
app.get('/api/products', (req, res) => productController.getAllProducts(req, res));
app.get('/api/products/:id', (req, res) => productController.getProductById(req, res));

// Admin-Protected Product Management (RBAC)
app.post('/api/products', authenticateToken, checkRole(['admin']), (req, res) =>
  productController.createProduct(req, res)
);
app.put('/api/products/:id', authenticateToken, checkRole(['admin']), (req, res) =>
  productController.updateProduct(req, res)
);
app.delete('/api/products/:id', authenticateToken, checkRole(['admin']), (req, res) =>
  productController.deleteProduct(req, res)
);

// Order Routes
app.post('/api/orders', authenticateToken, (req, res) => orderController.createOrder(req, res));
app.get('/api/orders/my-orders', authenticateToken, (req, res) =>
  orderController.getUserOrders(req, res)
);

// Admin-Protected Orders Management (RBAC)
app.get('/api/orders', authenticateToken, checkRole(['admin']), (req, res) =>
  orderController.getAllOrders(req, res)
);
app.patch('/api/orders/:id/status', authenticateToken, checkRole(['admin']), (req, res) =>
  orderController.updateOrderStatus(req, res)
);

// Live Support Chat Routes
app.get('/api/chat', (req, res) => chatController.getMessages(req, res));
app.post('/api/chat', (req, res) => chatController.sendMessage(req, res));

// --- 🤖 AI API ENDPOINTS ---
app.post('/api/ai/chat', (req, res) => aiController.chatAssistant(req, res));
app.post('/api/ai/compare', (req, res) => aiController.compareProducts(req, res));
app.get('/api/ai/reviews/:id', (req, res) => aiController.summarizeReviews(req, res));
app.post('/api/ai/bundle', (req, res) => aiController.generateBundle(req, res));

const PORT = process.env.PORT || 5000;

// Start Server and Sync Database
if (process.env.NODE_ENV !== 'test') {
  syncDatabase().then(() => {
    server.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 E-Commerce REST API Server running on port ${PORT}`);
      console.log(`🤖 AI Tech Assistant Endpoints Active (/api/ai)`);
      console.log(`=================================================`);
    });
  });
}

module.exports = app;
