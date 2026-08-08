# Broker Compare Platform (Stock + Forex Brokers)

A complete, production-ready full-stack web application similar to Finology Select, allowing users to compare Stock Brokers (Zerodha, Angel One, Groww, m.Stock, FYERS) and Forex Brokers (Exness, VT Markets, Vantage, StarTrader, EC Markets) side-by-side.

---

## 📁 Repository Folder Structure

```
broker-compare-platform/
│
├── backend/            # Express.js, MongoDB, Mongoose, JWT Auth, Swagger API Docs, Seed Script
├── admin-panel/        # React.js (Vite), Tailwind CSS, Admin Management Dashboard
└── user-panel/         # React.js (Vite), Tailwind CSS, Finology-style Comparison Portal
```

---

## ⚡ Quick Start Guide

### 1. Backend API & Database Seeding

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```
- **Backend API**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

### 2. Admin Panel

```bash
cd admin-panel
npm install
cp .env.example .env
npm run dev
```
- **Admin Panel URL**: `http://localhost:3001`
- **Credentials**: `admin@brokercompare.com` / `Admin@123`

### 3. User Panel

```bash
cd user-panel
npm install
cp .env.example .env
npm run dev
```
- **User Website URL**: `http://localhost:3000`

---

## ✨ Features Included

- **Side-by-Side Comparison Engine**: Compare 2 or 3 brokers with automated highlight badges (Best Overall, Best Value, Lowest Charges, Highest Rating, Fastest Execution, Best Platform, Best Support).
- **Dynamic Feature System**: Create custom comparison fields (Text, Boolean, Number, Rating, Currency, Percentage) via Admin without code changes.
- **Full MongoDB Seed Script**: 10 detailed stock & forex brokers pre-populated with fee schedules, pros/cons, platforms, and scores.
- **RESTful API**: JWT auth, Express Validator, Helmet, CORS, Morgan, Swagger docs, CSV export for newsletter subscribers.
- **Modern Responsive UI**: Dark mode UI, glassmorphism, instant auto-suggestions search bar.
