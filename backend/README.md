# Broker Compare Platform - Backend API

Production-ready Express.js & MongoDB backend for the Broker Compare Platform (Stock + Forex Brokers).

## 🚀 Features
- **MVC Architecture**: Models, Controllers, Routes, Services, Helpers, Middlewares.
- **Authentication**: JWT Token + Refresh Token system for Admin authentication with bcrypt password hashing.
- **Dynamic Comparison Engine**: Calculates dynamic highlights (Best Value, Lowest Charges, Highest Rating, Fastest Execution, Best Platform, Best Support, Best Overall) for 2 or 3 brokers side-by-side.
- **Dynamic Feature System**: Custom comparison fields (Text, Boolean, Number, Rating, Currency, Percentage) configurable via Admin without code changes.
- **Multer File Uploads**: Image management for broker logos, banners, blog post covers, and avatars.
- **Security**: Helmet HTTP headers, Rate Limiting, Input Sanitization, Express Validator, and CORS.
- **Swagger Documentation**: Interactive OpenAPI documentation at `/api-docs`.
- **Database Seeding**: Included seed script with 10 detailed brokers (5 Stock: Zerodha, Angel One, Groww, m.Stock, FYERS; 5 Forex: Exness, VT Markets, Vantage, StarTrader, EC Markets).

---

## 🛠️ Installation & Setup

1. **Navigate to the folder**:
   ```bash
   cd backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Seed Database**:
   Make sure MongoDB service is running, then populate seed data:
   ```bash
   npm run seed
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   # or
   npm start
   ```

Server runs on: `http://localhost:5000`  
Swagger API Docs: `http://localhost:5000/api-docs`

---

## 🔐 Default Admin Credentials
- **Email**: `admin@brokercompare.com`
- **Password**: `Admin@123`
