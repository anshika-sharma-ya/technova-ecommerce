# NovaStore — Full-Stack E-Commerce Final Internship Project

NovaStore is a comprehensive, production-ready full-stack e-commerce web application built to fulfill all requirements for the Full Stack React & Node Training Final Project.

---

## 🌟 Key Features & Requirements Matrix

| Requirement | Implementation Details |
| :--- | :--- |
| **1. Functional E-Commerce SPA** | Complete catalog, live search, cart management, checkout flow, admin dashboard, live customer support chat, and real-time order alerts. |
| **2. Responsive SPA Frontend** | Built with **React 18, Vite, React Router 6, Context API, and modern CSS**. |
| **3. RESTful API Backend** | **Node.js + Express** REST API structured into Controller-Service-Repository architecture with modular endpoints. |
| **4. Database & ORM** | **PostgreSQL** (with local SQLite fallback) mapped via **Sequelize ORM** with normalized models and foreign key relationships. |
| **5. Auth & RBAC** | **JWT Authentication** + **Role-Based Access Control (RBAC)** middleware securing Customer vs Admin endpoints (`/api/admin`). |
| **6. Real-Time Chat & Alerts** | **WebSockets (Socket.io)** powering customer live support chat and real-time order notifications. |
| **7. AWS Deployment Ready** | Production deployment script `aws-deploy.sh` for AWS EC2 instances. |
| **8. CI/CD Pipeline** | `.github/workflows/ci-cd.yml` workflow for automated testing and Docker image builds. |
| **9. Containerization** | `Dockerfile` (Backend + Frontend) and `docker-compose.yml` for multi-container startup. |
| **10. Automated Tests** | Jest & Supertest integration tests for backend APIs, Auth, RBAC, and product management. |

---

## 📐 Design Patterns Highlight

1. **Repository Pattern** (`backend/src/repositories/`):
   - Decouples database models from business logic.
   - `userRepository.js`, `productRepository.js`, `orderRepository.js`.

2. **Strategy Pattern** (`backend/src/services/paymentService.js`):
   - Encapsulates payment algorithms into interchangeable strategies:
     - `CreditCardPaymentStrategy`
     - `PaypalPaymentStrategy`
     - `CashOnDeliveryStrategy`

3. **Observer Pattern** (`backend/src/services/notificationService.js`):
   - Subject notifies all registered observers (like WebSocket Socket.io server) whenever an order is created or status is updated.

4. **Singleton Pattern** (`frontend/src/services/api.js` & `backend/src/config/database.js`):
   - Guarantees single instances for database connections and API client calls.

5. **Factory & Strategy Helpers**:
   - Automated database seeder and response formatters.

---

## 🚀 Local Setup Instructions

### Quick Start (Local Node & SQLite Zero-Config Mode)

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend automatically starts on `http://localhost:5000` and creates an auto-seeded SQLite database `ecommerce_dev.sqlite`.*

#### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

### Docker Compose Setup (PostgreSQL + Express + React)

To launch the full stack with PostgreSQL in Docker with a single command:

```bash
docker-compose up --build
```

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **PostgreSQL**: `localhost:5432`

---

## 🔑 Pre-seeded Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@ecommerce.com` | `user123` | Shopping, Cart, Checkout, Support Chat |
| **Admin** | `admin@ecommerce.com` | `admin123` | RBAC Protected Admin Dashboard (`/admin`), Add/Delete Items, Update Order Status |

---

## 🧪 Running Automated Tests

```bash
cd backend
npm test
```

Tests run via **Jest & Supertest**, validating:
- User signup and login JWT issuance
- RBAC authorization guards (Customer blocked from Admin endpoints)
- Product creation, fetching, and updating
