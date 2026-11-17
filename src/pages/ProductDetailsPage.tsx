import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Info,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
} from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { formatINR } from '../services/mockData';
import { ResilientImage } from '../components/ResilientImage';
import { useBulkCalculator } from '../hooks/useBulkCalculator';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, startNegotiation, placeOrder, pushToast } = useSmartDeal();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedImg, setSelectedImg] = useState(product.image);
  const [quantity, setQuantity] = useState<number>(Math.max(product.moq, 20));
  const [offerPerUnit, setOfferPerUnit] = useState<number>(
    Math.round(product.originalPrice * 0.8)
  );
  const [offerNote, setOfferNote] = useState('');
  const [offerError, setOfferError] = useState('');

  useEffect(() => {
    setSelectedImg(product.image);
    setQuantity(Math.max(product.moq, 20));
    setOfferPerUnit(Math.round(product.originalPrice * 0.8));
  }, [product]);

  const calc = useBulkCalculator(product, quantity);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferError('');
    if (quantity < product.moq) {
      setOfferError(`Minimum order quantity for this seller is ${product.moq} units.`);
      return;
    }
    if (offerPerUnit <= 0 || offerPerUnit >= product.originalPrice) {
      setOfferError(
        `Offer price should be between ₹1 and listed price (${formatINR(product.originalPrice)}).`
      );
      return;
    }

    const threadId = startNegotiation({
      product,
      quantity,
      offerPricePerUnit: offerPerUnit,
      note: offerNote,
    });
    navigate(`/negotiations/${threadId}`);
  };

  const handleBuyAtBulkTier = () => {
    if (!calc) return;
    if (quantity < product.moq) {
      pushToast('Check minimum order quantity', `Minimum order is ${product.moq} units.`, 'error');
      return;
    }
    placeOrder({
      product,
      quantity,
      unitPrice: calc.unitPrice,
      orderType: calc.discountPercent > 0 ? 'Bulk Discount' : 'Direct',
    });
  };

  const totalOfferAmount = quantity * offerPerUnit;
  const offerSavings = Math.max(0, (product.originalPrice - offerPerUnit) * quantity);

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#14213D] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Product Gallery + Specs */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden aspect-[4/3]">
              <ResilientImage
                src={selectedImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border transition-all ${
                      selectedImg === imgUrl
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                        : 'border-[#E2E8F0] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <ResilientImage src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Specs */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <h2 className="text-sm font-bold text-[#14213D] mb-3">Product Specifications</h2>
              <dl className="divide-y divide-[#E2E8F0] text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="py-2.5 flex justify-between gap-4">
                    <dt className="text-[#64748B]">{spec.label}</dt>
                    <dd className="font-medium text-[#1E293B] text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right: Contiguous Purchase + Bulk + Negotiation Module */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{product.stock} units available</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">MOQ: {product.moq} units</span>
              </div>

              <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
                {product.name}
              </h1>

              {/* Seller Info */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#64748B]">
                <span className="font-medium text-[#1E293B]">{product.sellerName}</span>
                {product.sellerVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#10B981]">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Seller
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E293B] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {product.sellerRating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {product.sellerCity}
                </span>
              </div>

              <p className="mt-4 text-sm text-[#64748B] leading-relaxed">{product.description}</p>

              {/* Listed Price & Quantity Selector */}
              <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#64748B] block">Original Listed Price</span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="text-2xl font-bold text-[#14213D] tabular-nums">
                      {formatINR(calc?.unitPrice ?? product.originalPrice)}
                    </span>
                    <span className="text-sm text-[#64748B]">/ unit</span>
                    {calc && calc.discountPercent > 0 && (
                      <>
                        <span className="text-sm text-[#64748B] line-through tabular-nums">
                          {formatINR(product.originalPrice)}
                        </span>
                        <span className="text-xs font-semibold bg-[#DCFCE7] text-[#14213D] px-2 py-0.5 rounded tabular-nums">
                          {calc.discountPercent}% Bulk Off
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#64748B]">Quantity</span>
                  <div className="inline-flex items-center border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(product.moq, q - 5))}
                      aria-label="Decrease quantity"
                      className="p-2 text-[#14213D] hover:bg-white rounded-l-lg"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={product.moq}
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-16 text-center text-sm font-semibold text-[#14213D] bg-transparent tabular-nums focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 5))}
                      aria-label="Increase quantity"
                      className="p-2 text-[#14213D] hover:bg-white rounded-r-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Discount Table */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Bulk Discount Tiers (click a row to apply)
                  </h2>
                  <Link to="/bulk-discounts" className="text-xs font-semibold text-[#2563EB] hover:underline">
                    Open Bulk Calculator
                  </Link>
                </div>
                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8FAFC] text-[#64748B] text-xs">
                      <tr>
                        <th className="py-2.5 px-4 text-left font-semibold">Quantity</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Price / Unit</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Discount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                      {product.bulkTiers.map((tier, idx) => {
                        const isActive =
                          calc?.activeTier.minQty === tier.minQty &&
                          calc?.activeTier.maxQty === tier.maxQty;
                        const label = tier.maxQty ? `${tier.minQty}–${tier.maxQty}` : `${tier.minQty}+`;
                        return (
                          <tr
                            key={idx}
                            onClick={() => setQuantity(Math.max(product.moq, tier.minQty))}
                            className={`cursor-pointer transition-colors ${
                              isActive ? 'bg-[#DCFCE7]/60' : 'hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-medium text-[#1E293B]">
                              {label} units
                            </td>
                            <td className="py-2.5 px-4 text-right font-semibold text-[#14213D]">
                              {formatINR(tier.pricePerUnit)}
                            </td>
                            <td className="py-2.5 px-4 text-right font-semibold text-[#10B981]">
                              {tier.discountPercent}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {calc && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
                    <div>
                      <p className="text-xs text-[#64748B]">Instant Bulk Total ({quantity} units)</p>
                      <p className="text-lg font-bold text-[#14213D] tabular-nums">
                        {formatINR(calc.totalAmount)}{' '}
                        {calc.totalSavings > 0 && (
                          <span className="text-xs font-semibold text-[#10B981]">
                            (Save {formatINR(calc.totalSavings)})
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBuyAtBulkTier}
                      className="px-4 py-2.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold whitespace-nowrap transition-colors"
                    >
                      Buy at Bulk Price
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dedicated Price Negotiation Section */}
            <div
              id="negotiate"
              className="bg-white border border-[#2563EB]/30 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#14213D]">Make Your Best Offer</h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    Propose a custom unit price directly to {product.sellerName}.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitOffer} className="mt-5 space-y-4">
                {offerError && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                    {offerError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                      Desired quantity
                    </label>
                    <input
                      type="number"
                      min={product.moq}
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                      Your offer per unit (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={offerPerUnit}
                      onChange={(e) => setOfferPerUnit(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                    Message to seller (optional)
                  </label>
                  <input
                    type="text"
                    value={offerNote}
                    onChange={(e) => setOfferNote(e.target.value)}
                    placeholder={`I would like to purchase ${quantity} units at ${formatINR(offerPerUnit)} each.`}
                    className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="bg-[#DCFCE7]/50 border border-[#10B981]/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-[#64748B] block">
                      Calculated Total Offer Price
                    </span>
                    <span className="text-xl font-bold text-[#14213D] tabular-nums">
                      {formatINR(totalOfferAmount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#64748B] block">Potential Savings</span>
                    <span className="text-sm font-bold text-[#10B981] tabular-nums inline-flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {formatINR(offerSavings)} off listed price
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
                >
                  Submit Offer
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#64748B] leading-relaxed">
                <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <p>
                  Once submitted, the seller can accept your offer immediately, decline it, or send
                  a counteroffer inside your live SmartDeal negotiation room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
