import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ArrowLeftRight } from 'lucide-react';
import { ToastContainer } from '../components/ToastContainer';
import { useSmartDeal } from '../contexts/SmartDealContext';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface DashboardLayoutProps {
  roleLabel: string;
  items: SidebarNavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  roleLabel,
  items,
  activeTab,
  onTabChange,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, logout, login } = useSmartDeal();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-[#E2E8F0] shrink-0">
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#E2E8F0]">
          <Link to="/" className="text-lg font-bold tracking-tight text-[#14213D] flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#14213D] text-white text-xs font-bold">
              S
            </span>
            <span>SmartDeal</span>
          </Link>
          <span className="text-xs font-medium text-[#64748B]">{roleLabel}</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label={`${roleLabel} navigation`}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#14213D] text-white'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#DCFCE7] text-[#14213D]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0] space-y-1">
          <Link
            to="/products"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D]"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col border-r border-[#E2E8F0] z-10">
            <div className="h-16 px-5 flex items-center justify-between border-b border-[#E2E8F0]">
              <Link to="/" className="text-lg font-bold text-[#14213D]">
                SmartDeal
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="p-1.5 rounded-lg text-[#64748B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-[#14213D] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs font-semibold tabular-nums">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden p-2 rounded-lg text-[#14213D] hover:bg-[#F8FAFC]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-[#64748B] truncate">
              <span>{roleLabel}</span>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="font-semibold text-[#14213D]">
                {items.find((i) => i.id === activeTab)?.label || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
              <button
                type="button"
                onClick={() => {
                  login('aarav@mehtaoffice.in', 'buyer');
                  navigate('/buyer/dashboard');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  roleLabel === 'Buyer Portal'
                    ? 'bg-white text-[#14213D] shadow-sm'
                    : 'text-[#64748B] hover:text-[#14213D]'
                }`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => {
                  login('sales@technovaperipherals.in', 'seller');
                  navigate('/seller/dashboard');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  roleLabel === 'Seller Portal'
                    ? 'bg-white text-[#14213D] shadow-sm'
                    : 'text-[#64748B] hover:text-[#14213D]'
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => {
                  login('admin@smartdeal.in', 'admin');
                  navigate('/admin/dashboard');
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  roleLabel === 'Admin Console'
                    ? 'bg-white text-[#14213D] shadow-sm'
                    : 'text-[#64748B] hover:text-[#14213D]'
                }`}
              >
                Admin
              </button>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-[#1E293B]">
                {currentUser?.fullName || 'Guest User'}
              </p>
              <p className="text-[11px] text-[#64748B]">
                {currentUser?.businessName || currentUser?.email}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
