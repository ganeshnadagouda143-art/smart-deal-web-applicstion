import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../services/mockData';
import { ResilientImage } from './ResilientImage';
import { useSmartDeal } from '../contexts/SmartDealContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { wishlistIds, toggleWishlist } = useSmartDeal();
  const isWishlisted = wishlistIds.includes(product.id);
  const maxDiscountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    <article className="group bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-[#F8FAFC] overflow-hidden">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <ResilientImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </Link>
        <span className="absolute top-3 left-3 bg-[#DCFCE7] text-[#14213D] text-xs font-semibold px-2.5 py-1 rounded-md tabular-nums">
          Save up to {maxDiscountPercent}%
        </span>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#2563EB] text-[#2563EB]' : ''}`} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-1.5">
          <span className="truncate">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums shrink-0">{product.stock} in stock</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="text-base font-semibold text-[#1E293B] hover:text-[#2563EB] line-clamp-2 transition-colors"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="truncate">{product.sellerName}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-0.5 text-[#1E293B] font-medium tabular-nums shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {product.sellerRating.toFixed(1)}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-baseline justify-between gap-2">
          <div>
            <span className="text-xs text-[#64748B] block">Bulk from</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#14213D] tabular-nums">
                {formatINR(product.discountedPrice)}
              </span>
              <span className="text-xs text-[#64748B] line-through tabular-nums">
                {formatINR(product.originalPrice)}
              </span>
            </div>
          </div>
          <span className="text-xs font-medium text-[#64748B] tabular-nums">
            MOQ {product.moq}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product.id}`}
            className="text-center px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#14213D] hover:bg-[#F8FAFC] transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => navigate(`/products/${product.id}#negotiate`)}
            className="px-3 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold transition-colors whitespace-nowrap"
          >
            Negotiate Price
          </button>
        </div>
      </div>
    </article>
  );
};
