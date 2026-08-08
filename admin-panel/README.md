# Broker Compare Platform - Admin Panel

React & Vite powered Admin Dashboard for managing Stock & Forex brokers, dynamic comparison features, ratings, content, and inquiries.

## 🛠️ Features
- **Broker Management**: CRUD operations for Stock & Forex brokers with multi-tab configuration (Basic Specs, Scores, Trading Platforms, Fee Schedule, Advanced Execution Features, Pros & Cons, Verdict).
- **Dynamic Feature Engine**: Define custom comparison fields (Text, Boolean, Number, Rating, Currency, Percentage) dynamically without changing code.
- **Popular Matchups Builder**: Create popular comparison pairings (e.g., Zerodha vs Groww, Exness vs Vantage).
- **Content Management**: Manage Categories, Promotional Banners, Blog Posts, FAQs, User Testimonials, Customer Inquiries, and Newsletter Email Export.
- **Authentication**: JWT auth persistence with automatic logout on token expiration.

---

## 🛠️ Installation & Setup

1. **Navigate to the folder**:
   ```bash
   cd admin-panel
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

Runs on: `http://localhost:3001`

---

## 🔐 Login Credentials
- **Email**: `admin@brokercompare.com`
- **Password**: `Admin@123`
