import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  MessageSquare,
  Layers,
  Users,
  ShoppingBag,
  BarChart3,
  User,
  CheckCircle2,
  XCircle,
  Send,
} from 'lucide-react';
import { DashboardLayout, SidebarNavItem } from '../layouts/DashboardLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { CATEGORIES, formatINR } from '../services/mockData';
import { OrderStatus, ProductCategory } from '../types';
import { ResilientImage } from '../components/ResilientImage';

const PRESET_PRODUCT_IMAGES = [
  {
    label: 'Wireless Mouse (Electronics)',
    url: '/src/assets/images/product_wireless_mouse_1794910760673.jpg',
  },
  {
    label: 'ANC Earbuds (Electronics)',
    url: '/src/assets/images/product_anc_earbuds_1794910763771.jpg',
  },
  {
    label: 'Tri-Ply Cookware (Home & Kitchen)',
    url: '/src/assets/images/product_stainless_cookware_1794910761011.jpg',
  },
  {
    label: 'Cotton Polo Bundle (Clothing)',
    url: '/src/assets/images/product_cotton_polo_1794910761630.jpg',
  },
  {
    label: 'Notebook Kit (Stationery)',
    url: '/src/assets/images/product_notebook_stationery_1794910763597.jpg',
  },
  {
    label: 'PPE Safety Kit (Industrial)',
    url: '/src/assets/images/product_industrial_safety_1794910763501.jpg',
  },
];

export const SellerDashboardPage: React.FC = () => {
  const {
    currentUser,
    products,
    negotiations,
    campaigns,
    orders,
    addProduct,
    removeProduct,
    acceptBuyerOfferAsSeller,
    rejectBuyerOfferAsSeller,
    sendSellerCounteroffer,
    updateOrderStatus,
    pushToast,
  } = useSmartDeal();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [counterDrafts, setCounterDrafts] = useState<Record<string, number>>({});

  // Add Product Form State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState<ProductCategory>('Electronics');
  const [prodImg, setProdImg] = useState(PRESET_PRODUCT_IMAGES[0].url);
  const [prodPrice, setProdPrice] = useState<number>(600);
  const [prodStock, setProdStock] = useState<number>(200);
  const [prodMoq, setProdMoq] = useState<number>(10);
  const [tier1Discount, setTier1Discount] = useState<number>(5);
  const [tier2Discount, setTier2Discount] = useState<number>(12);
  const [tier3Discount, setTier3Discount] = useState<number>(20);
  const [formError, setFormError] = useState('');

  const pendingNegotiations = negotiations.filter((n) => n.status === 'pending');
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const sidebarItems: SidebarNavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package, badge: products.length },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    {
      id: 'negotiations',
      label: 'Negotiation Requests',
      icon: MessageSquare,
      badge: pendingNegotiations.length,
    },
    { id: 'bulk-discounts', label: 'Bulk Discounts', icon: Layers },
    { id: 'group-buying', label: 'Group Buying Campaigns', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (prodName.trim().length < 3) {
      setFormError('Please enter a descriptive product name.');
      return;
    }
    if (prodDesc.trim().length < 10) {
      setFormError('Please provide a short product description.');
      return;
    }
    if (prodPrice <= 0) {
      setFormError('Original price must be greater than zero.');
      return;
    }

    const bulkTiers = [
      { minQty: 1, maxQty: 10, pricePerUnit: prodPrice, discountPercent: 0 },
      {
        minQty: 11,
        maxQty: 25,
        pricePerUnit: Math.round(prodPrice * (1 - tier1Discount / 100)),
        discountPercent: tier1Discount,
      },
      {
        minQty: 26,
        maxQty: 50,
        pricePerUnit: Math.round(prodPrice * (1 - tier2Discount / 100)),
        discountPercent: tier2Discount,
      },
      {
        minQty: 51,
        maxQty: null,
        pricePerUnit: Math.round(prodPrice * (1 - tier3Discount / 100)),
        discountPercent: tier3Discount,
      },
    ];

    addProduct({
      name: prodName.trim(),
      description: prodDesc.trim(),
      category: prodCat,
      image: prodImg,
      originalPrice: prodPrice,
      stock: prodStock,
      moq: prodMoq,
      bulkTiers,
    });

    setProdName('');
    setProdDesc('');
    setActiveTab('products');
  };

  return (
    <DashboardLayout
      roleLabel="Seller Portal"
      items={sidebarItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#14213D]">
                {currentUser?.businessName || 'TechNova Peripherals Pvt. Ltd.'}
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                Manage buyer price requests, configure volume tiers, and track wholesale orders.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('add-product')}
              className="px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold whitespace-nowrap"
            >
              + Add New Product
            </button>
          </div>

          {/* 4 Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Products</p>
              <p className="mt-2 text-2xl font-bold text-[#14213D] tabular-nums">
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
              <p className="text-xs font-medium text-[#64748B]">Pending Negotiations</p>
              <p className="mt-2 text-2xl font-bold text-[#2563EB] tabular-nums">
                {pendingNegotiations.length}
              </p>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <p className="text-xs font-medium text-[#64748B]">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-[#10B981] tabular-nums">
                {formatINR(totalRevenue)}
              </p>
            </div>
          </div>

          {/* Pending Negotiation Requests Quick View */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#14213D]">Recent Negotiation Requests</h2>
              <button
                type="button"
                onClick={() => setActiveTab('negotiations')}
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Manage all offers
              </button>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {negotiations.map((neg) => (
                <div
                  key={neg.id}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#14213D]">
                      {neg.productName}{' '}
                      <span className="text-xs font-normal text-[#64748B]">
                        · {neg.buyerName}
                      </span>
                    </p>
                    <p className="text-xs text-[#64748B] mt-1 tabular-nums">
                      Listed: {formatINR(neg.listedPrice)} · Buyer Offer:{' '}
                      <span className="font-bold text-[#14213D]">
                        {formatINR(neg.currentOfferPrice)}/unit
                      </span>{' '}
                      × {neg.desiredQuantity} units · Status:{' '}
                      <span className="font-semibold capitalize">{neg.status}</span>
                    </p>
                  </div>
                  {neg.status !== 'accepted' && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => acceptBuyerOfferAsSeller(neg.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold"
                      >
                        Accept Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => rejectBuyerOfferAsSeller(neg.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 text-xs font-semibold"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('negotiations')}
                        className="px-3 py-1.5 rounded-lg bg-[#14213D] text-white text-xs font-semibold"
                      >
                        Counteroffer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#14213D]">My Product Listings</h1>
            <button
              type="button"
              onClick={() => setActiveTab('add-product')}
              className="px-3.5 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
            >
              + Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Product</th>
                  <th className="py-3 px-4 text-left font-semibold">Category</th>
                  <th className="py-3 px-4 text-right font-semibold">Base Price</th>
                  <th className="py-3 px-4 text-right font-semibold">Max Bulk Price</th>
                  <th className="py-3 px-4 text-right font-semibold">Stock</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden border border-[#E2E8F0] shrink-0">
                          <ResilientImage
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-[#14213D]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">{p.category}</td>
                    <td className="py-3 px-4 text-right">{formatINR(p.originalPrice)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#10B981]">
                      {formatINR(p.discountedPrice)}
                    </td>
                    <td className="py-3 px-4 text-right">{p.stock}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'add-product' && (
        <form
          onSubmit={handleAddProductSubmit}
          className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-2xl space-y-5"
        >
          <div>
            <h1 className="text-lg font-bold text-[#14213D]">Add New Negotiable Product</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Configure unit pricing, stock, MOQ, and tiered bulk discounts.
            </p>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">Product Name</label>
            <input
              type="text"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
              placeholder="e.g. Ergonomic Mechanical Keyboard"
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">Description</label>
            <textarea
              rows={3}
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              placeholder="Describe specifications, packaging, and warranty..."
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">Category</label>
              <select
                value={prodCat}
                onChange={(e) => setProdCat(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">Product Image</label>
              <select
                value={prodImg}
                onChange={(e) => setProdImg(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white"
              >
                {PRESET_PRODUCT_IMAGES.map((img) => (
                  <option key={img.url} value={img.url}>
                    {img.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                min={1}
                value={prodPrice}
                onChange={(e) => setProdPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={1}
                value={prodStock}
                onChange={(e) => setProdStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">
                Min Order Qty (MOQ)
              </label>
              <input
                type="number"
                min={1}
                value={prodMoq}
                onChange={(e) => setProdMoq(Number(e.target.value))}
                className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-bold text-[#14213D]">Bulk Discount Configuration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-medium text-[#64748B] mb-1">
                  11–25 units (% off)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={tier1Discount}
                  onChange={(e) => setTier1Discount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-[#64748B] mb-1">
                  26–50 units (% off)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={tier2Discount}
                  onChange={(e) => setTier2Discount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-[#64748B] mb-1">
                  51+ units (% off)
                </label>
                <input
                  type="number"
                  min={0}
                  max={70}
                  value={tier3Discount}
                  onChange={(e) => setTier3Discount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg tabular-nums"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold"
          >
            Publish Product Listing
          </button>
        </form>
      )}

      {activeTab === 'negotiations' && (
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-[#14213D]">Buyer Negotiation Requests</h1>
          {negotiations.map((neg) => {
            const draftVal = counterDrafts[neg.id] ?? Math.round((neg.listedPrice + neg.currentOfferPrice) / 2);
            return (
              <div
                key={neg.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-[#14213D]">{neg.productName}</h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Buyer: <span className="font-medium text-[#1E293B]">{neg.buyerName}</span> ·
                      Updated {neg.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums">
                    <span className="text-xs text-[#64748B]">
                      Listed: {formatINR(neg.listedPrice)}
                    </span>
                    <span className="text-sm font-bold text-[#2563EB]">
                      Current Offer: {formatINR(neg.currentOfferPrice)}/unit ({neg.desiredQuantity}u)
                    </span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 space-y-1.5 text-xs">
                  {neg.messages.slice(-2).map((m) => (
                    <p key={m.id} className="text-[#1E293B]">
                      <span className="font-semibold">
                        {m.senderRole === 'buyer' ? 'Buyer' : 'You'}:
                      </span>{' '}
                      {m.text}
                    </p>
                  ))}
                </div>

                {neg.status === 'accepted' ? (
                  <p className="text-xs font-semibold text-[#10B981]">
                    Deal agreed at {formatINR(neg.finalAgreedPrice || neg.currentOfferPrice)}/unit
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => acceptBuyerOfferAsSeller(neg.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Offer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectBuyerOfferAsSeller(neg.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Offer</span>
                    </button>
                    <div className="flex items-center gap-2 ml-auto">
                      <label className="text-xs text-[#64748B]">Counter (₹/unit):</label>
                      <input
                        type="number"
                        min={1}
                        value={draftVal}
                        onChange={(e) =>
                          setCounterDrafts((prev) => ({
                            ...prev,
                            [neg.id]: Math.max(1, Number(e.target.value)),
                          }))
                        }
                        className="w-24 px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg text-xs tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => sendSellerCounteroffer(neg.id, draftVal)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-xs font-semibold"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Counteroffer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'bulk-discounts' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
          <h1 className="text-lg font-bold text-[#14213D]">Active Bulk Discount Schedules</h1>
          <div className="divide-y divide-[#E2E8F0]">
            {products.map((p) => (
              <div key={p.id} className="py-4">
                <p className="text-sm font-bold text-[#14213D]">{p.name}</p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs tabular-nums">
                  {p.bulkTiers.map((t, idx) => (
                    <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
                      <span className="text-[#64748B] block">
                        {t.maxQty ? `${t.minQty}–${t.maxQty} units` : `${t.minQty}+ units`}
                      </span>
                      <span className="font-bold text-[#14213D]">
                        {formatINR(t.pricePerUnit)} ({t.discountPercent}% off)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'group-buying' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Group Buying Campaigns</h1>
          </div>
          <div className="divide-y divide-[#E2E8F0]">
            {campaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.currentQuantity / c.targetQuantity) * 100));
              return (
                <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#14213D]">{c.productName}</p>
                    <p className="text-xs text-[#64748B] mt-1 tabular-nums">
                      Group Price: {formatINR(c.groupBuyPrice)} ({c.discountPercent}% off) · Closes{' '}
                      {c.deadline}
                    </p>
                  </div>
                  <div className="w-full sm:w-56">
                    <div className="flex justify-between text-xs font-semibold tabular-nums mb-1">
                      <span>
                        {c.currentQuantity} / {c.targetQuantity} units
                      </span>
                      <span className="text-[#10B981]">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h1 className="text-lg font-bold text-[#14213D]">Incoming Seller Orders</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-xs text-[#64748B]">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Order ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Buyer</th>
                  <th className="py-3 px-4 text-left font-semibold">Product</th>
                  <th className="py-3 px-4 text-right font-semibold">Qty</th>
                  <th className="py-3 px-4 text-right font-semibold">Amount</th>
                  <th className="py-3 px-4 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 px-4 font-semibold text-[#14213D]">{o.id}</td>
                    <td className="py-3 px-4 text-[#1E293B]">{o.buyerName}</td>
                    <td className="py-3 px-4 text-[#64748B]">{o.productName}</td>
                    <td className="py-3 px-4 text-right">{o.quantity}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {formatINR(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 border border-[#E2E8F0] rounded text-xs font-medium bg-white"
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

      {activeTab === 'analytics' && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-6">
          <h1 className="text-lg font-bold text-[#14213D]">Sales & Negotiation Analytics</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <p className="text-xs text-[#64748B]">Offer Acceptance Rate</p>
              <p className="text-2xl font-bold text-[#14213D] mt-1">68.5%</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <p className="text-xs text-[#64748B]">Average Wholesale Order Size</p>
              <p className="text-2xl font-bold text-[#14213D] mt-1">33 units</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
              <p className="text-xs text-[#64748B]">Avg. Seller Response Time</p>
              <p className="text-2xl font-bold text-[#10B981] mt-1">42 mins</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushToast('Seller profile saved', 'Business verification details updated.', 'success');
          }}
          className="bg-white border border-[#E2E8F0] rounded-xl p-6 max-w-xl space-y-4"
        >
          <h1 className="text-lg font-bold text-[#14213D]">Seller Business Profile</h1>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Business Name
            </label>
            <input
              type="text"
              defaultValue={currentUser?.businessName || 'TechNova Peripherals Pvt. Ltd.'}
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">GSTIN</label>
            <input
              type="text"
              defaultValue="29AABCT1332L1Z5"
              className="w-full px-3.5 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#14213D] text-white text-sm font-semibold"
          >
            Update Business Details
          </button>
        </form>
      )}
    </DashboardLayout>
  );
};
