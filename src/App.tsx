import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { SmartDealProvider } from './contexts/SmartDealContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { NegotiationPage } from './pages/NegotiationPage';
import { BulkDiscountPage } from './pages/BulkDiscountPage';
import { GroupBuyingPage } from './pages/GroupBuyingPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

export default function App() {
  return (
    <SmartDealProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/negotiations" element={<NegotiationPage />} />
          <Route path="/negotiations/:id" element={<NegotiationPage />} />
          <Route path="/bulk-discounts" element={<BulkDiscountPage />} />
          <Route path="/group-buying" element={<GroupBuyingPage />} />
          <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SmartDealProvider>
  );
}
