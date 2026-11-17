import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { GroupBuyCampaign } from '../types';
import { formatINR } from '../services/mockData';
import { ResilientImage } from './ResilientImage';

interface GroupBuyCardProps {
  campaign: GroupBuyCampaign;
  onJoinClick: (campaign: GroupBuyCampaign) => void;
  onViewDetails?: (campaign: GroupBuyCampaign) => void;
}

export const GroupBuyCard: React.FC<GroupBuyCardProps> = ({
  campaign,
  onJoinClick,
  onViewDetails,
}) => {
  const progress = Math.min(
    100,
    Math.round((campaign.currentQuantity / campaign.targetQuantity) * 100)
  );
  const remaining = Math.max(0, campaign.targetQuantity - campaign.currentQuantity);

  return (
    <article className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
        <ResilientImage
          src={campaign.image}
          alt={campaign.productName}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-[#DCFCE7] text-[#14213D] text-xs font-semibold px-2.5 py-1 rounded-md tabular-nums">
          {campaign.discountPercent}% Group Discount
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1">
          <span>{campaign.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{campaign.sellerName}</span>
        </div>

        <h3 className="text-base font-semibold text-[#1E293B] line-clamp-2">
          {campaign.productName}
        </h3>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#14213D] tabular-nums">
              {formatINR(campaign.groupBuyPrice)}
            </span>
            <span className="text-xs text-[#64748B] line-through tabular-nums">
              {formatINR(campaign.originalPrice)}
            </span>
          </div>
          <span className="text-xs font-medium text-[#10B981] tabular-nums">
            {progress}% completed
          </span>
        </div>

        <div className="mt-2.5">
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#64748B] tabular-nums">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {campaign.currentQuantity} / {campaign.targetQuantity} units
            </span>
            <span>{remaining > 0 ? `${remaining} left` : 'Target reached'}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Closes {campaign.deadline}
          </span>
          <span className="tabular-nums">{campaign.participants.length} buyers</span>
        </div>

        <div className="mt-4 flex gap-2">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(campaign)}
              className="flex-1 px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#14213D] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
            >
              Details
            </button>
          )}
          <button
            type="button"
            onClick={() => onJoinClick(campaign)}
            className="flex-1 px-3 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            Join Group
          </button>
        </div>
      </div>
    </article>
  );
};
