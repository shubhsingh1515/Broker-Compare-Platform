import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BrokerList from './pages/BrokerList';
import BrokerForm from './pages/BrokerForm';
import DynamicFeatures from './pages/DynamicFeatures';
import Categories from './pages/Categories';
import PopularComparisons from './pages/PopularComparisons';
import Banners from './pages/Banners';
import Blogs from './pages/Blogs';
import BlogForm from './pages/BlogForm';
import FAQs from './pages/FAQs';
import Testimonials from './pages/Testimonials';
import Contacts from './pages/Contacts';
import Newsletter from './pages/Newsletter';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="brokers" element={<BrokerList />} />
            <Route path="brokers/new" element={<BrokerForm />} />
            <Route path="brokers/edit/:id" element={<BrokerForm />} />
            <Route path="features" element={<DynamicFeatures />} />
            <Route path="categories" element={<Categories />} />
            <Route path="popular-comparisons" element={<PopularComparisons />} />
            <Route path="banners" element={<Banners />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            <Route path="faqs" element={<FAQs />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="newsletter" element={<Newsletter />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
