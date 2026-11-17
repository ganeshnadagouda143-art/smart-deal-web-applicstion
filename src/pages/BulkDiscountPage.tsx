import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { useBulkCalculator } from '../hooks/useBulkCalculator';
import { formatINR } from '../services/mockData';
import { ResilientImage } from '../components/ResilientImage';

export const BulkDiscountPage: React.FC = () => {
  const { products, placeOrder } = useSmartDeal();
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const [quantity, setQuantity] = useState<number>(30);

  const calc = useBulkCalculator(selectedProduct, quantity);

  const handlePlaceBulkOrder = () => {
    if (!selectedProduct || !calc) return;
    placeOrder({
      product: selectedProduct,
      quantity,
      unitPrice: calc.unitPrice,
      orderType: 'Bulk Discount',
    });
    navigate('/buyer/dashboard');
  };

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
            Quantity-Based Bulk Discounts
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#64748B]">
            Select a product and adjust your order quantity to calculate automatic volume pricing
            and instant wholesale savings.
          </p>
        </div>

        {/* Product Selector Strip */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 mb-8">
          <p className="text-xs font-semibold text-[#64748B] mb-3">Select Product to Configure</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {products.slice(0, 4).map((p) => {
              const active = p.id === selectedProduct.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedProductId(p.id);
                    setQuantity(Math.max(p.moq, 26));
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    active
                      ? 'border-[#2563EB] bg-[#2563EB]/5'
                      : 'border-[#E2E8F0] hover:border-[#64748B]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden border border-[#E2E8F0] shrink-0">
                    <ResilientImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#14213D] truncate">{p.name}</p>
                    <p className="text-xs text-[#64748B] tabular-nums mt-0.5">
                      Base {formatINR(p.originalPrice)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedProduct && calc && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Tier Table & Quantity Slider */}
            <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-[#64748B]">
                    {selectedProduct.category} · {selectedProduct.sellerName}
                  </span>
                  <h2 className="text-xl font-bold text-[#14213D] mt-0.5">
                    {selectedProduct.name}
                  </h2>
                </div>
                <Link
                  to={`/products/${selectedProduct.id}#negotiate`}
                  className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Want custom pricing? Negotiate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Interactive Quantity Selector */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <label
                      htmlFor="bulk-qty-input"
                      className="text-sm font-semibold text-[#14213D] block"
                    >
                      Interactive Quantity Selector
                    </label>
                    <p className="text-xs text-[#64748B]">
                      Slide or type exact units ({selectedProduct.stock} available)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="bulk-qty-input"
                      type="number"
                      min={1}
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.min(selectedProduct.stock, Math.max(1, Number(e.target.value))))
                      }
                      className="w-24 px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-base font-bold text-center text-[#14213D] tabular-nums focus:outline-none focus:border-[#2563EB]"
                    />
                    <span className="text-sm font-medium text-[#64748B]">units</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={Math.min(150, selectedProduct.stock)}
                  value={Math.min(150, quantity)}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />

                {calc.nextTier && (
                  <p className="text-xs font-medium text-[#2563EB] tabular-nums">
                    Add {calc.unitsToNextTier} more{' '}
                    {calc.unitsToNextTier === 1 ? 'unit' : 'units'} to unlock{' '}
                    {calc.nextTier.discountPercent}% off ({formatINR(calc.nextTier.pricePerUnit)}
                    /unit).
                  </p>
                )}
              </div>

              {/* Tier Breakdown Table */}
              <div>
                <h3 className="text-sm font-bold text-[#14213D] mb-3">
                  Volume Pricing Breakdown
                </h3>
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8FAFC] text-[#64748B] text-xs">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold">Quantity</th>
                        <th className="py-3 px-4 text-right font-semibold">Price Per Unit</th>
                        <th className="py-3 px-4 text-right font-semibold">Discount</th>
                        <th className="py-3 px-4 text-right font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                      {selectedProduct.bulkTiers.map((tier, idx) => {
                        const isActive =
                          calc.activeTier.minQty === tier.minQty &&
                          calc.activeTier.maxQty === tier.maxQty;
                        const label = tier.maxQty
                          ? `${tier.minQty}–${tier.maxQty}`
                          : `${tier.minQty}+`;
                        return (
                          <tr
                            key={idx}
                            onClick={() => setQuantity(tier.minQty)}
                            className={`cursor-pointer transition-colors ${
                              isActive ? 'bg-[#DCFCE7]' : 'hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <td className="py-3 px-4 font-semibold text-[#14213D]">{label}</td>
                            <td className="py-3 px-4 text-right font-bold text-[#14213D]">
                              {formatINR(tier.pricePerUnit)}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-[#10B981]">
                              {tier.discountPercent}%
                            </td>
                            <td className="py-3 px-4 text-right text-xs font-semibold">
                              {isActive ? (
                                <span className="text-[#14213D]">Active Tier</span>
                              ) : (
                                <span className="text-[#64748B]">Click to apply</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Automatic Discount Calculator & Savings Comparison */}
            <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-[#14213D]">Order & Savings Summary</h2>

              <div className="space-y-3 text-sm border-b border-[#E2E8F0] pb-4 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Selected Quantity</span>
                  <span className="font-semibold text-[#1E293B]">{quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Standard Retail Total</span>
                  <span className="text-[#64748B] line-through">
                    {formatINR(calc.standardTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Applied Unit Price</span>
                  <span className="font-semibold text-[#14213D]">
                    {formatINR(calc.unitPrice)} / unit ({calc.discountPercent}% off)
                  </span>
                </div>
              </div>

              <div className="bg-[#DCFCE7] border border-[#10B981]/30 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#14213D] block">
                    Total Bulk Savings
                  </span>
                  <span className="text-xl font-bold text-[#14213D] tabular-nums">
                    {formatINR(calc.totalSavings)}
                  </span>
                </div>
                <CheckCircle2 className="w-7 h-7 text-[#10B981] shrink-0" />
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-semibold text-[#1E293B]">Final Total Amount</span>
                <span className="text-2xl font-bold text-[#14213D] tabular-nums">
                  {formatINR(calc.totalAmount)}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePlaceBulkOrder}
                className="w-full py-3 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Place Bulk Order</span>
              </button>

              <p className="text-xs text-[#64748B] text-center">
                Need a lower unit price for {quantity}+ units?{' '}
                <Link
                  to={`/products/${selectedProduct.id}#negotiate`}
                  className="text-[#2563EB] font-semibold hover:underline"
                >
                  Negotiate directly with seller
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
};
