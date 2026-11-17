import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Send,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { formatINR } from '../services/mockData';
import { ResilientImage } from '../components/ResilientImage';
import { NegotiationStatus } from '../types';

const STATUS_STYLES: Record<
  NegotiationStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'Awaiting Seller', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
  countered: { label: 'Counteroffer Ready', bg: 'bg-[#2563EB]/10 border-[#2563EB]/30', text: 'text-[#2563EB]' },
  accepted: { label: 'Price Agreed', bg: 'bg-[#DCFCE7] border-[#10B981]/30', text: 'text-[#14213D]' },
  rejected: { label: 'Declined', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
};

export const NegotiationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    negotiations,
    products,
    acceptCounteroffer,
    rejectCounteroffer,
    submitBuyerOffer,
    sendSellerCounteroffer,
    placeOrder,
  } = useSmartDeal();

  const activeThread =
    negotiations.find((n) => n.id === id) || negotiations[0] || null;

  const [newOfferPrice, setNewOfferPrice] = useState<number>(430);
  const [newOfferQty, setNewOfferQty] = useState<number>(20);
  const [newOfferMessage, setNewOfferMessage] = useState('');
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);

  // Demo helper state to test seller counteroffer directly inside workspace
  const [sellerCounterInput, setSellerCounterInput] = useState<number>(440);

  useEffect(() => {
    if (activeThread) {
      setNewOfferPrice(Math.max(1, activeThread.currentOfferPrice - 15));
      setNewOfferQty(activeThread.desiredQuantity);
      setSellerCounterInput(Math.max(1, activeThread.currentOfferPrice + 25));
      setShowNewOfferForm(false);
    }
  }, [activeThread?.id]);

  const handleMakeNewOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || newOfferPrice <= 0) return;
    submitBuyerOffer(activeThread.id, newOfferPrice, newOfferQty, newOfferMessage);
    setNewOfferMessage('');
    setShowNewOfferForm(false);
  };

  const handleConvertOrder = () => {
    if (!activeThread) return;
    const product = products.find((p) => p.id === activeThread.productId);
    if (!product) return;
    const agreed = activeThread.finalAgreedPrice ?? activeThread.currentOfferPrice;
    placeOrder({
      product,
      quantity: activeThread.desiredQuantity,
      unitPrice: agreed,
      orderType: 'Negotiated',
    });
    navigate('/buyer/dashboard');
  };

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
              Price Negotiation Workspace
            </h1>
            <p className="mt-1 text-sm text-[#64748B]">
              Negotiate unit pricing directly with sellers, review counteroffers, and lock your final deal.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            <span>Start new negotiation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!activeThread ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center">
            <MessageSquare className="w-10 h-10 text-[#64748B] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#14213D]">No active negotiations yet</h2>
            <p className="text-sm text-[#64748B] mt-1">
              Browse products and submit an offer to begin negotiating with a seller.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block px-5 py-2.5 rounded-lg bg-[#2563EB] text-white text-sm font-semibold"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Thread List */}
            <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#14213D]">Offer Threads</h2>
                <span className="text-xs font-medium text-[#64748B] tabular-nums">
                  {negotiations.length} active
                </span>
              </div>
              <div className="divide-y divide-[#E2E8F0] max-h-[560px] overflow-y-auto">
                {negotiations.map((thread) => {
                  const isSelected = thread.id === activeThread.id;
                  const statusMeta = STATUS_STYLES[thread.status];
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => navigate(`/negotiations/${thread.id}`)}
                      className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                        isSelected ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]/60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0">
                        <ResilientImage
                          src={thread.productImage}
                          alt={thread.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#14213D] truncate">
                            {thread.productName}
                          </p>
                        </div>
                        <p className="text-xs text-[#64748B] truncate mt-0.5">
                          {thread.sellerName}
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#1E293B] tabular-nums">
                            {formatINR(thread.currentOfferPrice)}/unit · {thread.desiredQuantity}u
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${statusMeta.bg} ${statusMeta.text}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Active Negotiation Chat & Controls */}
            <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col">
              {/* Top Product + Seller + Listed Price Header */}
              <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E2E8F0] shrink-0 bg-white">
                    <ResilientImage
                      src={activeThread.productImage}
                      alt={activeThread.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={`/products/${activeThread.productId}`}
                      className="text-base font-bold text-[#14213D] hover:text-[#2563EB] truncate block"
                    >
                      {activeThread.productName}
                    </Link>
                    <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{activeThread.sellerName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeThread.sellerCity}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-[#64748B] block">Listed Price</span>
                    <span className="text-sm font-semibold text-[#64748B] line-through tabular-nums">
                      {formatINR(activeThread.listedPrice)}/unit
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-[#64748B] block">Current Quote</span>
                    <span className="text-base font-bold text-[#14213D] tabular-nums">
                      {formatINR(activeThread.currentOfferPrice)}/unit
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      STATUS_STYLES[activeThread.status].bg
                    } ${STATUS_STYLES[activeThread.status].text}`}
                  >
                    {STATUS_STYLES[activeThread.status].label}
                  </span>
                </div>
              </div>

              {/* Final Agreed Price Banner if Accepted */}
              {activeThread.status === 'accepted' && activeThread.finalAgreedPrice && (
                <div className="px-5 py-4 bg-[#DCFCE7] border-b border-[#10B981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#14213D]">
                      Final Agreed Price Locked
                    </p>
                    <p className="text-lg font-bold text-[#14213D] tabular-nums">
                      {formatINR(activeThread.finalAgreedPrice)} / unit ×{' '}
                      {activeThread.desiredQuantity} units ={' '}
                      {formatINR(activeThread.finalAgreedPrice * activeThread.desiredQuantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConvertOrder}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold whitespace-nowrap transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm & Place Order</span>
                  </button>
                </div>
              )}

              {/* Offer History Timeline */}
              <div className="p-5 space-y-4 min-h-[300px] max-h-[420px] overflow-y-auto bg-white">
                {activeThread.messages.map((msg) => {
                  const isBuyer = msg.senderRole === 'buyer';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-1">
                        <span className="font-semibold text-[#1E293B]">
                          {isBuyer ? 'Buyer' : 'Seller'} · {msg.senderName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          isBuyer
                            ? 'bg-[#2563EB] text-white rounded-br-sm'
                            : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-bl-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.offerPricePerUnit !== undefined && (
                          <div
                            className={`mt-2 pt-2 border-t text-xs font-semibold flex items-center justify-between gap-4 tabular-nums ${
                              isBuyer
                                ? 'border-white/20 text-white/95'
                                : 'border-[#E2E8F0] text-[#14213D]'
                            }`}
                          >
                            <span>
                              {msg.type === 'counteroffer'
                                ? 'Counteroffer'
                                : msg.type === 'accept'
                                ? 'Accepted Price'
                                : 'Proposed Offer'}
                              : {formatINR(msg.offerPricePerUnit)}/unit
                            </span>
                            {msg.quantity && <span>Qty: {msg.quantity}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Controls Footer */}
              <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
                {activeThread.status !== 'accepted' && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => acceptCounteroffer(activeThread.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Accept {activeThread.status === 'countered' ? 'Counteroffer' : 'Quote'} (
                        {formatINR(activeThread.currentOfferPrice)}/unit)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => rejectCounteroffer(activeThread.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-sm font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Counteroffer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowNewOfferForm((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#14213D] hover:bg-[#1E293B] text-white text-sm font-semibold transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Make New Offer</span>
                    </button>
                  </div>
                )}

                {showNewOfferForm && (
                  <form
                    onSubmit={handleMakeNewOffer}
                    className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">
                          New Price / Unit (₹)
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={newOfferPrice}
                          onChange={(e) => setNewOfferPrice(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={newOfferQty}
                          onChange={(e) => setNewOfferQty(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#64748B] mb-1">
                          Note to Seller
                        </label>
                        <input
                          type="text"
                          value={newOfferMessage}
                          onChange={(e) => setNewOfferMessage(e.target.value)}
                          placeholder="Optional terms..."
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowNewOfferForm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#64748B]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold"
                      >
                        Send Revised Offer
                      </button>
                    </div>
                  </form>
                )}

                {/* Interactive Seller Response Demo Bar */}
                {activeThread.status === 'pending' && (
                  <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#64748B]">
                      Test Seller Response on this thread:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={sellerCounterInput}
                        onChange={(e) => setSellerCounterInput(Math.max(1, Number(e.target.value)))}
                        className="w-24 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-lg text-xs tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => sendSellerCounteroffer(activeThread.id, sellerCounterInput)}
                        className="px-3 py-1.5 rounded-lg border border-[#14213D] text-xs font-semibold text-[#14213D] hover:bg-white"
                      >
                        Simulate Seller Counteroffer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
};
