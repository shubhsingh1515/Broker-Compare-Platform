import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import BrokerList from './pages/BrokerList';
import BrokerDetail from './pages/BrokerDetail';
import ComparePage from './pages/ComparePage';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  return (
    <CompareProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col justify-between bg-gray-950 text-gray-100 font-sans selection:bg-sky-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/brokers" element={<BrokerList />} />
              <Route path="/broker/:slug" element={<BrokerDetail />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </CompareProvider>
  );
};

export default App;
