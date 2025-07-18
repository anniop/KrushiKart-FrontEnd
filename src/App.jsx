import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import MyOrdersPage from './components/MyOrdersPage';
import ProductDetailPage from './components/ProductDetailPage';
import SellerLoginPage from './components/SellerLoginPage';
import SellerDashboardPage from './components/SellerDashboardPage';
import SellerProtectedRoute from './components/SellerProtectedRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-light">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            
            {/* Seller Routes */}
            <Route path="/seller/login" element={<SellerLoginPage />} />
            <Route path="/seller/dashboard" element={
              <SellerProtectedRoute>
                <SellerDashboardPage />
              </SellerProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
