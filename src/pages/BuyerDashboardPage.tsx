import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  MessageSquare,
  Users,
  ShoppingBag,
  Heart,
  Bell,
  User,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout, SidebarNavItem } from '../layouts/DashboardLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { formatINR } from '../services/mockData';
import { ProductCard } from '../components/ProductCard';
import { GroupBuyCard } from '../components/GroupBuyCard';

export const BuyerDashboardPage: React.FC = () => {
  const {
    currentUser,
    products,
    negotiations,
    campaigns,
    orders,
    wishlistIds,
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    joinGroupCampaign,
    pushToast,
  } = useSmartDeal();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [profileName, setProfileName] = useState(currentUser?.fullName || 'Aarav Mehta');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '+91 98201 44210');
  const [profileCity, setProfileCity] = useState(currentUser?.city || 'Mumbai');

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.roleTarget === 'buyer' || n.roleTarget === 'all')
  ).length;

  const sidebarItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Products', icon: Compass },
    { id: 'negotiations', label: 'My Negotiations', icon: MessageSquare, badge: negotiations.length },
    { id: 'group-buying', label: 'Group Buying', icon: Users },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistIds.length },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const activeNegotiations = negotiations.filter(
    (n) => n.status === 'pending' || n.status === 'countered'
  );
  const successfulDeals = negotiations.filter((n) => n.status === 'accepted').length + orders.length;
  const totalSavings = orders.reduce((acc, o) => acc + o.savings, 0);
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const buyerNotifications = notifications.filter(
    (n) => n.roleTarget === 'buyer' || n.roleTarget === 'all'
  );

  return (
    <DashboardLayout
      roleLabel="Buyer Portal"
      items={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#14213D]">
                Welcome back, {currentUser?.fullName || 'Aarav Mehta'}
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                Track active seller counteroffers, order savings, and group-buy progress.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap"
            >
              <span>Browse New Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 4 Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
                {orders.length}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Active Negotiations</p>
              <p className="mt-2 text-2xl font-bold text-[#2563EB] tabular-nums">
                {activeNegotiations.length}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Successful Deals</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
                {successfulDeals}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Savings</p>
              <p className="mt-2 text-2xl font-bold text-[#10B981] tabular-nums">
                {formatINR(totalSavings)}
              </p>
            </div>
          </div>

          {/* Active Negotiations & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#14213D]">Active Negotiations</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('negotiations')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {negotiations.slice(0, 3).map((neg) => (
                  <div key={neg.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">
                        {neg.productName}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">
                        {neg.sellerName} · {neg.desiredQuantity} units ·{' '}
                        <span className="font-semibold text-[#14213D] tabular-nums">
                          {formatINR(neg.currentOfferPrice)}/unit
                        </span>
                      </p>
                    </div>
                    <Link
                      to={`/negotiations/${neg.id}`}
                      className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-xs font-semibold text-[#2563EB] whitespace-nowrap"
                    >
                      Open Chat
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#14213D]">Recent Orders</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  All orders
                </button>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">
                        {order.productName}
                      </p>
                      <p className="text-xs text-[#64748B] tabular-nums">
                        {order.id} · {order.quantity} units · Saved {formatINR(order.savings)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#14213D] tabular-nums">
                        {formatINR(order.totalAmount)}
                      </p>
                      <p className="text-xs font-medium text-[#10B981]">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#14213D]">Recommended Products</h2>
              <Link to="/products" className="text-xs font-semibold text-[#2563EB] hover:underline">
                Explore full catalog
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {products.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

          {/* Available Group-Buy Campaigns */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#14213D]">Available Group-Buy Campaigns</h2>
              <Link
                to="/group-buying"
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                View all campaigns
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {campaigns.slice(0, 3).map((c) => (
                <GroupBuyCard
                  key={c.id}
                  campaign={c}
                  onJoinClick={(camp) => joinGroupCampaign(camp.id, 10)}
                  onViewDetails={() => navigate('/group-buying')}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#14213D]">Explore Negotiable Catalog</h1>
            <Link to="/products" className="text-sm font-semibold text-[#2563EB] hover:underline">
              Open full filter view
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'negotiations' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#14213D]">My Price Negotiations</h1>
            <Link
              to="/products"
              className="px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
            >
              Start New Offer
            </Link>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {negotiations.map((neg) => (
              <div
                key={neg.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-base font-semibold text-[#14213D]">{neg.productName}</p>
                  <p className="text-xs text-[#64748B] mt-1">
                    Seller: {neg.sellerName} · Listed {formatINR(neg.listedPrice)} · Current Offer{' '}
                    <span className="font-semibold text-[#14213D] tabular-nums">
                      {formatINR(neg.currentOfferPrice)}/unit
                    </span>{' '}
                    for {neg.desiredQuantity} units
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#14213D] capitalize">
                    {neg.status}
                  </span>
                  <Link
                    to={`/negotiations/${neg.id}`}
                    className="px-4 py-2 rounded-lg bg-[#14213D] text-white text-xs font-semibold whitespace-nowrap"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'group-buying' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#14213D]">Active Group Buying Campaigns</h1>
            <Link
              to="/group-buying"
              className="text-sm font-semibold text-[#2563EB] hover:underline"
            >
              Campaign rules & participants
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <GroupBuyCard
                key={c.id}
                campaign={c}
                onJoinClick={(camp) => joinGroupCampaign(camp.id, 10)}
                onViewDetails={() => navigate('/group-buying')}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">My Orders & Savings</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Product</th>
                  <th className="py-3 px-4 text-left font-semibold">Type</th>
                  <th className="py-3 px-4 text-right font-semibold">Qty</th>
                  <th className="py-3 px-4 text-right font-semibold">Total</th>
                  <th className="py-3 px-4 text-right font-semibold">Saved</th>
                  <th className="py-3 px-4 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-semibold text-[#14213D]">{order.id}</td>
                    <td className="py-3 px-4 text-[#1E293B]">{order.productName}</td>
                    <td className="py-3 px-4 text-xs text-[#64748B]">{order.orderType}</td>
                    <td className="py-3 px-4 text-right">{order.quantity}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#14213D]">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#10B981]">
                      {formatINR(order.savings)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-[#14213D]">Saved Wishlist</h1>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center">
              <p className="text-sm text-[#64748B]">Your wishlist is currently empty.</p>
              <Link
                to="/products"
                className="mt-3 inline-block px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#14213D]">Notifications</h1>
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {buyerNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer ${
                  notif.read ? 'bg-white' : 'bg-[#F8FAFC]'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-[#14213D] flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${notif.read ? 'text-[#64748B]' : 'text-[#10B981]'}`}
                    />
                    <span>{notif.title}</span>
                  </p>
                  <p className="text-xs text-[#64748B] mt-1">{notif.message}</p>
                </div>
                <span className="text-xs text-[#64748B] shrink-0">{notif.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushToast('Profile updated', 'Your buyer account preferences were saved.', 'success');
          }}
          className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-xl space-y-4"
        >
          <h1 className="text-lg font-bold text-[#14213D]">Buyer Profile Settings</h1>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Full Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">Phone Number</label>
            <input
              type="text"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">City</label>
            <input
              type="text"
              value={profileCity}
              onChange={(e) => setProfileCity(e.target.value)}
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#14213D] text-white text-sm font-semibold"
          >
            Save Profile
          </button>
        </form>
      )}
    </DashboardLayout>
  );
};
