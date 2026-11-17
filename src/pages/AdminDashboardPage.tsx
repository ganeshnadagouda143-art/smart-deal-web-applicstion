import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingBag,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import { DashboardLayout, SidebarNavItem } from '../layouts/DashboardLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { formatINR } from '../services/mockData';
import { OrderStatus } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    users,
    products,
    orders,
    complaints,
    verifySellerUser,
    toggleSuspendUser,
    removeProduct,
    updateOrderStatus,
    resolveComplaint,
  } = useSmartDeal();

  const [activeTab, setActiveTab] = useState<string>('overview');

  const totalSellers = users.filter((u) => u.role === 'seller').length;
  const totalBuyers = users.filter((u) => u.role === 'buyer').length;
  const totalTransactions = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const unverifiedSellers = users.filter((u) => u.role === 'seller' && !u.verified);
  const reportedUsers = users.filter((u) => u.status === 'Reported' || u.status === 'Suspended');
  const openComplaints = complaints.filter((c) => c.status !== 'Resolved');

  const sidebarItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Manage Users', icon: Users, badge: users.length },
    {
      id: 'verify-sellers',
      label: 'Verify Sellers',
      icon: ShieldCheck,
      badge: unverifiedSellers.length,
    },
    { id: 'listings', label: 'Product Listings', icon: Package, badge: products.length },
    { id: 'orders', label: 'Monitor Orders', icon: ShoppingBag, badge: orders.length },
    {
      id: 'complaints',
      label: 'Review Complaints',
      icon: AlertTriangle,
      badge: openComplaints.length,
    },
    {
      id: 'reported',
      label: 'Reported Accounts',
      icon: UserX,
      badge: reportedUsers.length,
    },
  ];

  return (
    <DashboardLayout
      roleLabel="Admin Console"
      items={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-[#14213D]">Platform Administration</h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Oversee marketplace integrity, seller verification, transactions, and compliance
              tickets.
            </p>
          </div>

          {/* 6 Admin KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Users</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">{users.length}</p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Sellers</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
                {totalSellers}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Buyers</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
                {totalBuyers}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-[#2563EB] tabular-nums">
                {products.length}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
                {orders.length}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Transactions</p>
              <p className="mt-2 text-2xl font-bold text-[#10B981] tabular-nums">
                {formatINR(totalTransactions)}
              </p>
            </div>
          </div>

          {/* Pending Seller Verifications + Open Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#14213D]">Seller Verification Queue</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('verify-sellers')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Open queue
                </button>
              </div>
              {unverifiedSellers.length === 0 ? (
                <p className="text-sm text-[#64748B]">All pending sellers have been verified.</p>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {unverifiedSellers.map((seller) => (
                    <div key={seller.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#1E293B]">
                          {seller.businessName || seller.fullName}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {seller.fullName} · {seller.city}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => verifySellerUser(seller.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold"
                      >
                        Approve KYC
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[#14213D]">Open Complaints</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Review all
                </button>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {complaints.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] truncate">{c.subject}</p>
                      <p className="text-xs text-[#64748B] truncate">
                        {c.id} · Reported: {c.reportedAccount} · {c.status}
                      </p>
                    </div>
                    {c.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => resolveComplaint(c.id, 'Resolved')}
                        className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#14213D] shrink-0"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Manage Marketplace Users</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Role</th>
                  <th className="py-3 px-4 text-left font-semibold">City</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#14213D]">{u.fullName}</p>
                      <p className="text-xs text-[#64748B]">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 capitalize text-[#64748B]">{u.role}</td>
                    <td className="py-3 px-4 text-[#64748B]">{u.city}</td>
                    <td className="py-3 px-4 font-medium">{u.status}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSuspendUser(u.id)}
                        className="text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        {u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'verify-sellers' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Seller KYC Verification</h1>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {users
              .filter((u) => u.role === 'seller')
              .map((seller) => (
                <div
                  key={seller.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-[#14213D]">
                      {seller.businessName || seller.fullName}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {seller.fullName} · {seller.email} · {seller.city}
                    </p>
                  </div>
                  {seller.verified ? (
                    <span className="text-xs font-semibold text-[#10B981]">Verified Merchant</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => verifySellerUser(seller.id)}
                      className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold"
                    >
                      Verify Seller Account
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Product Listings Moderation</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Product</th>
                  <th className="py-3 px-4 text-left font-semibold">Seller</th>
                  <th className="py-3 px-4 text-right font-semibold">Listed Price</th>
                  <th className="py-3 px-4 text-right font-semibold">Stock</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-semibold text-[#14213D]">{p.name}</td>
                    <td className="py-3 px-4 text-[#64748B]">{p.sellerName}</td>
                    <td className="py-3 px-4 text-right">{formatINR(p.originalPrice)}</td>
                    <td className="py-3 px-4 text-right">{p.stock}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Monitor Marketplace Orders</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Buyer / Seller</th>
                  <th className="py-3 px-4 text-right font-semibold">Total</th>
                  <th className="py-3 px-4 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 px-4 font-semibold text-[#14213D]">{o.id}</td>
                    <td className="py-3 px-4 text-xs text-[#64748B]">
                      {o.buyerName} → {o.sellerName}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatINR(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 border border-[#E2E8F0] rounded text-xs bg-white"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-[#14213D]">Review Complaints</h1>
          {complaints.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[#14213D]">
                    {c.id}: {c.subject}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Reporter: {c.reporterName} · Account: {c.reportedAccount} · {c.createdAt}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-[#64748B]">{c.description}</p>
              {c.status !== 'Resolved' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => resolveComplaint(c.id, 'Under Review')}
                    className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#14213D]"
                  >
                    Mark Under Review
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveComplaint(c.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold"
                  >
                    Resolve Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reported' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Reported Accounts</h1>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {reportedUsers.length === 0 ? (
              <p className="p-6 text-sm text-[#64748B]">No flagged accounts at this time.</p>
            ) : (
              reportedUsers.map((u) => (
                <div key={u.id} className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14213D]">{u.fullName}</p>
                    <p className="text-xs text-[#64748B]">
                      {u.email} · Status: {u.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSuspendUser(u.id)}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                  >
                    {u.status === 'Suspended' ? 'Reinstate Account' : 'Suspend Account'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
