# 🧾 FinanceFlow — Personal Finance Tracker

A modern, full-stack personal finance web application built to help users record income and expenses, visualize spending patterns through interactive charts, calculate savings rates in real-time, and securely manage their financial records.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=flat-square)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TailwindCSS%20%7C%20Recharts-61dafb?style=flat-square)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=flat-square)
![Database](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-brightgreen?style=flat-square)
![Authentication](https://img.shields.io/badge/Auth-JWT%20%7C%20Bcrypt-orange?style=flat-square)

---

## 🌐 Live Demo

- **Application URL:** [https://financeflow-tracker.vercel.app](https://financeflow-tracker.vercel.app) *(Live Demo Placeholder)*
- **Demo Access:** Click **"Try Demo Account"** on the landing page for immediate instant access with pre-populated sample charts and data.

---

## 📸 Screenshots

| ☀️ Dashboard Overview (Light Mode) | 🌙 Analytics & Cashflow (Dark Mode) |
| :---: | :---: |
| ![Dashboard Light Mode Placeholder](https://via.placeholder.com/600x350/f8fafc/4f46e5?text=FinanceFlow+Dashboard+Overview) | ![Analytics Dark Mode Placeholder](https://via.placeholder.com/600x350/0f172a/818cf8?text=Interactive+Charts+%26+Cashflow) |

| 💳 Add Transaction Modal | 📊 History & CSV Export |
| :---: | :---: |
| ![Add Transaction Modal Placeholder](https://via.placeholder.com/600x350/f8fafc/10b981?text=Add+Transaction+Modal) | ![Transaction History Placeholder](https://via.placeholder.com/600x350/0f172a/6366f1?text=Filterable+Table+%26+CSV+Export) |

---

## 🎯 Features

- **🔐 Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT) and Bcrypt salted password hashing. Includes a **Try Demo Account** shortcut for testing with isolated demo data.
- **📊 Real-time Financial Summary Cards:**
  - **Total Balance** (Live deficit / surplus detection)
  - **Total Income**
  - **Total Expenses**
  - **Savings Rate (%)** with animated progress indicator
- **📈 Interactive Data Visualizations:**
  - **Expenses by Category:** Recharts Donut/Pie Chart with customized tooltip and category legend.
  - **Monthly Cashflow Trends:** Recharts grouped Bar Chart comparing monthly income vs. expense.
- **💳 Transaction Management (CRUD):**
  - Add Income & Expense transactions with Title, Amount, Category, Date, Currency, and Notes.
  - Instant live updates across all stats and charts.
  - Delete individual transaction entries with confirmation.
- **🪙 Multi-Currency & Default Currency:**
  - Dynamic currency selector with dedicated **Default Currency** section and quick-set options.
- **🔍 Advanced Filtering & Search:**
  - Real-time text search by transaction title or notes.
  - Filter by transaction type (`All`, `Income`, `Expense`).
  - Filter by category (`Food & Dining`, `Rent & Housing`, `Salary`, `Freelance`, etc.).
- **📤 CSV Export:** Download filtered or complete transaction history directly into a formatted `.csv` spreadsheet file.
- **🌓 Dark & Light Mode:** Seamless theme toggle with persistent preferences saved to `localStorage`.
- **🛡️ Abuse Protection & Security Limits:**
  - **Rate Limiting:** `express-rate-limit` prevents brute-force on authentication (10 req/15 min) and API spam (100 req/15 min).
  - **HTTP Security Headers:** `helmet` applies OWASP-recommended security headers (HSTS, NoSniff, Frameguard).
  - **Payload Limits:** Strict `10kb` JSON payload limit against memory exhaustion.
  - **Storage Limits:** Maximum 500 transactions per normal user and 30 for demo users to protect free-tier database capacity.
  - **Automatic Cleanup (TTL Index):** 24-hour MongoDB TTL index auto-deletes expired demo data without touching real user accounts.
- **📱 Fully Responsive Design:** Clean glassmorphism layout optimized across mobile, tablet, and desktop viewports.

---

## 🧰 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS | Responsive UI, custom glassmorphism styles, Lucide icons |
| **State & Auth** | Context API, Axios | Global user state, JWT request/response interceptors |
| **Charts** | Recharts | Pie & Bar chart visualization components |
| **Backend** | Node.js, Express.js | RESTful API architecture, controllers & middleware pattern |
| **Database** | MongoDB, Mongoose | Schema validation, compound indexing, aggregation |
| **Notifications** | react-hot-toast | Non-intrusive UI feedback for actions and errors |

---

## 📂 Project Structure

```text
personal-finance-tracker/
├── client/                      # Frontend Application (React + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── AuthPage.jsx # Sign In / Sign Up & Demo login view
│   │   │   ├── dashboard/
│   │   │   │   ├── CategoryPieChart.jsx # Recharts expense distribution
│   │   │   │   ├── MonthlyBarChart.jsx  # Recharts monthly cashflow trends
│   │   │   │   ├── StatCards.jsx        # Summary cards (Income, Expense, Balance)
│   │   │   │   └── TransactionTable.jsx # Filterable table + CSV export
│   │   │   ├── forms/
│   │   │   │   └── AddTransactionModal.jsx # Income/Expense creation modal
│   │   │   └── layout/
│   │   │       └── Navbar.jsx   # Top bar with profile & theme switcher
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state & currency provider
│   │   ├── utils/
│   │   │   └── formatCurrency.js# Multi-currency formatting & default config
│   │   ├── App.jsx              # Main Dashboard integration
│   │   ├── index.css            # Tailwind directives & glassmorphism utilities
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                      # Backend REST API (Node.js + Express + MongoDB)
    ├── src/
    │   ├── config/
    │   │   └── db.js            # MongoDB Mongoose connection
    │   ├── controllers/
    │   │   ├── authController.js# Registration, login, profile (/me), currency
    │   │   └── txnController.js # Transaction CRUD, summary & categories
    │   ├── middleware/
    │   │   └── authMiddleware.js# JWT verification guard
    │   ├── models/
    │   │   ├── Transaction.js   # Transaction schema & supported categories
    │   │   └── User.js          # User schema & Bcrypt password hashing
    │   ├── routes/
    │   │   ├── authRoutes.js    # /api/auth routes
    │   │   └── txnRoutes.js     # /api/transactions routes
    │   ├── seed.js              # Standalone demo data seed script
    │   └── server.js            # Express server initialization
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local MongoDB instance or free MongoDB Atlas cluster URI)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` or edit `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/personal_finance_tracker
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. (Optional) Seed demo user and sample data:
   ```bash
   npm run seed
   ```

5. Start the backend API:
   ```bash
   npm run dev
   ```
   The backend API will start on `http://localhost:5000`. Test the health check at `http://localhost:5000/api/health`.

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Verify `.env` configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at:
   👉 **http://localhost:5173/**

---

## 🔑 REST API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/currency` | Update user default currency preference | Yes (Bearer Token) |

### Transaction Endpoints (`/api/transactions`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | Fetch all user transactions (supports filters) | Yes (Bearer Token) |
| `POST` | `/api/transactions` | Create a new transaction | Yes (Bearer Token) |
| `DELETE`| `/api/transactions/:id`| Delete an existing transaction | Yes (Bearer Token) |
| `GET` | `/api/transactions/summary`| Compute aggregate balance, charts data | Yes (Bearer Token) |
| `GET` | `/api/transactions/categories`| Get list of supported categories | No |

---

## 👩‍💻 Author

**Kanchan Kumari**
- **GitHub:** [@KanchanKumari](https://github.com/KanchanKumari)
- **Role:** Full-Stack Web Developer

---

## 📄 License
ISC License — Created for educational & portfolio demonstration.
