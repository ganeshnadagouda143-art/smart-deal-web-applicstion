import React, { useState } from 'react';
import { Calendar, CheckCircle2, Users, X, ShieldCheck } from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { useSmartDeal } from '../contexts/SmartDealContext';
import { GroupBuyCard } from '../components/GroupBuyCard';
import { GroupBuyCampaign } from '../types';
import { formatINR } from '../services/mockData';
import { ResilientImage } from '../components/ResilientImage';

export const GroupBuyingPage: React.FC = () => {
  const { campaigns, joinGroupCampaign } = useSmartDeal();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [joinModalCampaign, setJoinModalCampaign] = useState<GroupBuyCampaign | null>(null);
  const [joinQty, setJoinQty] = useState<number>(10);

  const detailCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModalCampaign) return;
    joinGroupCampaign(joinModalCampaign.id, Math.max(1, joinQty));
    setSelectedCampaignId(joinModalCampaign.id);
    setJoinModalCampaign(null);
  };

  return (
    <PublicLayout>
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14213D] tracking-tight">
            Together We Buy. Together We Save.
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-[#64748B]">
            Join collective purchasing campaigns with other verified buyers to reach wholesale target
            quantities and lock steep manufacturer discounts.
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {campaigns.map((campaign) => (
            <GroupBuyCard
              key={campaign.id}
              campaign={campaign}
              onJoinClick={(c) => {
                setJoinModalCampaign(c);
                setJoinQty(10);
              }}
              onViewDetails={(c) => {
                setSelectedCampaignId(c.id);
                document.getElementById('campaign-details')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>

        {/* Selected Campaign Details Section */}
        {detailCampaign && (
          <div
            id="campaign-details"
            className="bg-white border border-[#E2E8F0] rounded-2xl p-6 lg:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC]">
                  <ResilientImage
                    src={detailCampaign.image}
                    alt={detailCampaign.productName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Original Unit Price</span>
                    <span className="line-through text-[#64748B] tabular-nums">
                      {formatINR(detailCampaign.originalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Group Buy Price</span>
                    <span className="font-bold text-[#14213D] tabular-nums">
                      {formatINR(detailCampaign.groupBuyPrice)} ({detailCampaign.discountPercent}%
                      off)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Target Quantity</span>
                    <span className="font-semibold text-[#1E293B] tabular-nums">
                      {detailCampaign.targetQuantity} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Current Committed</span>
                    <span className="font-semibold text-[#10B981] tabular-nums">
                      {detailCampaign.currentQuantity} units (
                      {Math.min(
                        100,
                        Math.round(
                          (detailCampaign.currentQuantity / detailCampaign.targetQuantity) * 100
                        )
                      )}
                      % completed)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Campaign Deadline</span>
                    <span className="font-medium text-[#1E293B] inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {detailCampaign.deadline}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">
                      Campaign Details · {detailCampaign.sellerName}
                    </p>
                    <h2 className="text-2xl font-bold text-[#14213D] mt-1">
                      {detailCampaign.productName}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setJoinModalCampaign(detailCampaign);
                      setJoinQty(10);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold whitespace-nowrap transition-colors"
                  >
                    Join This Group Buy
                  </button>
                </div>

                {/* Joining Rules */}
                <div>
                  <h3 className="text-sm font-bold text-[#14213D] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    <span>Campaign Joining Rules</span>
                  </h3>
                  <ul className="space-y-2">
                    {detailCampaign.rules.map((rule, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-[#64748B] leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Participant Information */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#14213D] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#14213D]" />
                      <span>Committed Participants</span>
                    </h3>
                    <span className="text-xs text-[#64748B] tabular-nums">
                      {detailCampaign.participants.length} buyers joined
                    </span>
                  </div>

                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#F8FAFC] text-[#64748B] text-xs">
                        <tr>
                          <th className="py-2.5 px-4 text-left font-semibold">Buyer</th>
                          <th className="py-2.5 px-4 text-left font-semibold">City</th>
                          <th className="py-2.5 px-4 text-right font-semibold">Committed</th>
                          <th className="py-2.5 px-4 text-right font-semibold">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {detailCampaign.participants.map((p) => (
                          <tr key={p.id}>
                            <td className="py-2.5 px-4 font-medium text-[#1E293B]">{p.name}</td>
                            <td className="py-2.5 px-4 text-[#64748B]">{p.city}</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-[#14213D] tabular-nums">
                              {p.quantity} units
                            </td>
                            <td className="py-2.5 px-4 text-right text-xs text-[#64748B]">
                              {p.joinedAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Join Group Modal */}
      {joinModalCampaign && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleJoinSubmit}
            className="bg-white border border-[#E2E8F0] rounded-xl max-w-md w-full p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#14213D]">Join Group Buy</h3>
                <p className="text-sm text-[#64748B] mt-0.5">{joinModalCampaign.productName}</p>
              </div>
              <button
                type="button"
                onClick={() => setJoinModalCampaign(null)}
                aria-label="Close modal"
                className="p-1 text-[#64748B] hover:text-[#14213D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                Quantity to commit (units)
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={joinQty}
                onChange={(e) => setJoinQty(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm tabular-nums focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="mt-4 bg-[#DCFCE7]/60 border border-[#10B981]/30 rounded-lg p-3.5 text-sm space-y-1 tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Locked Unit Price</span>
                <span className="font-bold text-[#14213D]">
                  {formatINR(joinModalCampaign.groupBuyPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Total Commitment</span>
                <span className="font-bold text-[#14213D]">
                  {formatINR(joinQty * joinModalCampaign.groupBuyPrice)}
                </span>
              </div>
              <div className="flex justify-between text-[#10B981] font-semibold text-xs pt-1">
                <span>Your Savings vs Original Price</span>
                <span>
                  {formatINR(
                    joinQty * (joinModalCampaign.originalPrice - joinModalCampaign.groupBuyPrice)
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setJoinModalCampaign(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold"
              >
                Confirm & Join Group
              </button>
            </div>
          </form>
        </div>
      )}
    </PublicLayout>
  );
};
