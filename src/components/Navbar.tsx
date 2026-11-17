import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSmartDeal } from '../contexts/SmartDealContext';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSmartDeal();

  const handleHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/#how-it-works');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dashboardPath =
    currentUser?.role === 'seller'
      ? '/seller/dashboard'
      : currentUser?.role === 'admin'
      ? '/admin/dashboard'
      : '/buyer/dashboard';

  const navLinkClass = (path: string) =>
    `text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
      location.pathname === path
        ? 'text-[#2563EB]'
        : 'text-[#64748B] hover:text-[#14213D]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-[#14213D] whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#14213D] text-white text-sm font-bold">
            S
          </span>
          <span>SmartDeal</span>
        </Link>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          <Link to="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link to="/products" className={navLinkClass('/products')}>
            Explore Products
          </Link>
          <Link to="/group-buying" className={navLinkClass('/group-buying')}>
            Group Buying
          </Link>
          <Link to="/bulk-discounts" className={navLinkClass('/bulk-discounts')}>
            Bulk Discounts
          </Link>
          <a
            href="/#how-it-works"
            onClick={handleHowItWorks}
            className="text-sm font-medium text-[#64748B] hover:text-[#14213D] whitespace-nowrap shrink-0 transition-colors duration-150"
          >
            How It Works
          </a>
        </nav>

        {/* Zone 3: Auth & Primary Action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <Link
              to={dashboardPath}
              className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {currentUser.role === 'seller'
                ? 'Seller Hub'
                : currentUser.role === 'admin'
                ? 'Admin Console'
                : 'Dashboard'}
            </Link>
          ) : (
            <>
              <Link
                to="/auth?mode=login"
                className="text-sm font-medium text-[#64748B] hover:text-[#14213D] px-2.5 py-2 whitespace-nowrap shrink-0 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth?mode=register"
                className="text-sm font-medium text-[#14213D] border border-[#E2E8F0] hover:border-[#14213D] px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            to="/negotiations"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors duration-150"
          >
            Start Negotiating
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="lg:hidden p-2 rounded-lg text-[#14213D] hover:bg-[#F8FAFC] transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Collapsible Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2E8F0] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              Explore Products
            </Link>
            <Link
              to="/group-buying"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              Group Buying
            </Link>
            <Link
              to="/bulk-discounts"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              Bulk Discounts
            </Link>
            <a
              href="/#how-it-works"
              onClick={handleHowItWorks}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
            >
              How It Works
            </a>
          </div>
          <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
            {currentUser ? (
              <Link
                to={dashboardPath}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#14213D]"
              >
                Open {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#14213D]"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg border border-[#14213D] text-sm font-medium text-[#14213D]"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <Link
              to="/negotiations"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center bg-[#2563EB] text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
            >
              Start Negotiating
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
