import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Shirt,
  ShoppingBasket,
  UtensilsCrossed,
  NotebookPen,
  HardHat,
  Search,
  HandCoins,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { CATEGORIES, HERO_ILLUSTRATION, formatINR } from '../services/mockData';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { ProductCard } from '../components/ProductCard';
import { GroupBuyCard } from '../components/GroupBuyCard';
import { ResilientImage } from '../components/ResilientImage';
import { GroupBuyCampaign, ProductCategory } from '../types';

const CATEGORY_ICONS: Record<ProductCategory, React.ComponentType<{ className?: string }>> = {
  Electronics: Cpu,
  Clothing: Shirt,
  Groceries: ShoppingBasket,
  'Home & Kitchen': UtensilsCrossed,
  Stationery: NotebookPen,
  'Industrial Supplies': HardHat,
};

export const LandingPage: React.FC = () => {
  const { products, campaigns, joinGroupCampaign } = useSmartDeal();
  const navigate = useNavigate();
  const [selectedCampaign, setSelectedCampaign] = useState<GroupBuyCampaign | null>(null);
  const [joinQty, setJoinQty] = useState(10);

  const trendingProducts = products.slice(0, 3);
  const featuredCampaigns = campaigns.slice(0, 3);

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    joinGroupCampaign(selectedCampaign.id, Math.max(1, joinQty));
    setSelectedCampaign(null);
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <p className="text-sm font-semibold text-[#2563EB] mb-3">
                Negotiate Better. Buy Smarter. Save More.
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#14213D] tracking-tight leading-[1.15] text-balance">
                Why Pay More When You Can Negotiate?
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                Discover better deals, negotiate directly with sellers, and unlock exclusive bulk
                discounts through smarter group buying.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/negotiations"
                  className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>Start Negotiating</span>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-xl font-bold text-[#14213D] tabular-nums">18.4%</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Avg. negotiation savings</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#14213D] tabular-nums">1,200+</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Verified Indian sellers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#10B981] tabular-nums">Up to 30%</p>
                  <p className="text-xs text-[#64748B] mt-0.5">Group & bulk tiers</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] aspect-[16/10] shadow-sm">
                <ResilientImage
                  src={HERO_ILLUSTRATION}
                  alt="SmartDeal buyers and sellers negotiating bulk marketplace deals"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Featured Categories
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Browse direct manufacturer and wholesale listings open for price negotiation.
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name];
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="text-left bg-white border border-[#E2E8F0] rounded-xl p-5 flex items-start gap-4 hover:border-[#2563EB] hover:shadow-sm transition-all duration-150"
              >
                <div className="w-11 h-11 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#14213D] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#1E293B] truncate">{cat.name}</h3>
                    <span className="text-xs font-semibold text-[#10B981] bg-[#DCFCE7] px-2 py-0.5 rounded shrink-0">
                      {cat.avgSavings}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">{cat.summary}</p>
                  <p className="text-xs text-[#64748B] mt-2 tabular-nums">
                    {cat.itemCount} negotiable listings
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trending Deals */}
      <section className="bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#14213D] tracking-tight">Trending Deals</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                High-demand inventory with active seller counteroffers and volume tiers.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How SmartDeal Works */}
      <section id="how-it-works" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl font-bold text-[#14213D] tracking-tight">How SmartDeal Works</h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Four structured steps from product discovery to final agreed wholesale pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Find your product',
              body: 'Compare verified Indian manufacturers, wholesalers, and transparent base prices.',
              icon: Search,
            },
            {
              step: '02',
              title: 'Make your offer',
              body: 'Enter your required quantity and propose your target price per unit directly.',
              icon: HandCoins,
            },
            {
              step: '03',
              title: 'Negotiate with sellers',
              body: 'Review instant seller counteroffers, accept deals, or revise your bid in real time.',
              icon: MessageSquare,
            },
            {
              step: '04',
              title: 'Save more through bulk buying',
              body: 'Unlock tiered quantity discounts or join active group-buy campaigns together.',
              icon: Layers,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#14213D] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-[#64748B] tabular-nums">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#14213D]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#64748B] leading-relaxed">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Group Buying Section */}
      <section className="bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#14213D] tracking-tight">
                Together We Buy. Together We Save.
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Pool unit commitments with other buyers to unlock manufacturer-level pricing.
              </p>
            </div>
            <Link
              to="/group-buying"
              className="text-sm font-semibold text-[#10B981] hover:text-[#059669] inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>All group-buy campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign) => (
              <GroupBuyCard
                key={campaign.id}
                campaign={campaign}
                onJoinClick={(c) => {
                  setSelectedCampaign(c);
                  setJoinQty(10);
                }}
                onViewDetails={() => navigate('/group-buying')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Join Group Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmJoin}
            className="bg-white border border-[#E2E8F0] rounded-xl max-w-md w-full p-6 shadow-xl"
          >
            <h3 className="text-lg font-bold text-[#14213D]">Join Group Buy Campaign</h3>
            <p className="text-sm text-[#64748B] mt-1">{selectedCampaign.productName}</p>

            <div className="mt-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Group Buy Price</span>
                <span className="font-bold text-[#14213D] tabular-nums">
                  {formatINR(selectedCampaign.groupBuyPrice)} / unit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Progress</span>
                <span className="font-medium text-[#10B981] tabular-nums">
                  {selectedCampaign.currentQuantity} / {selectedCampaign.targetQuantity} units
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Units to commit
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={joinQty}
                onChange={(e) => setJoinQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
              />
              <p className="mt-2 text-xs text-[#64748B] tabular-nums">
                Estimated total: {formatINR(joinQty * selectedCampaign.groupBuyPrice)} (You save{' '}
                {formatINR(
                  joinQty * (selectedCampaign.originalPrice - selectedCampaign.groupBuyPrice)
                )}
                )
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#64748B] hover:text-[#14213D]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold"
              >
                Confirm Commitment
              </button>
            </div>
          </form>
        </div>
      )}
    </PublicLayout>
  );
};
