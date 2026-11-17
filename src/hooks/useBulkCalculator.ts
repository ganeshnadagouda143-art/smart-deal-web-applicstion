import { useMemo } from 'react';
import { BulkDiscountTier, Product } from '../types';

export interface BulkCalculationResult {
  activeTier: BulkDiscountTier;
  unitPrice: number;
  discountPercent: number;
  totalAmount: number;
  standardTotal: number;
  totalSavings: number;
  nextTier: BulkDiscountTier | null;
  unitsToNextTier: number;
}

export function calculateBulkPricing(product: Product, quantity: number): BulkCalculationResult {
  const safeQty = Math.max(1, quantity);
  const tiers = product.bulkTiers;

  let activeTier = tiers[0];
  for (const tier of tiers) {
    if (safeQty >= tier.minQty && (tier.maxQty === null || safeQty <= tier.maxQty)) {
      activeTier = tier;
      break;
    }
  }

  const activeIndex = tiers.indexOf(activeTier);
  const nextTier = activeIndex >= 0 && activeIndex < tiers.length - 1 ? tiers[activeIndex + 1] : null;
  const unitsToNextTier = nextTier ? Math.max(0, nextTier.minQty - safeQty) : 0;

  const unitPrice = activeTier.pricePerUnit;
  const totalAmount = unitPrice * safeQty;
  const standardTotal = product.originalPrice * safeQty;
  const totalSavings = Math.max(0, standardTotal - totalAmount);

  return {
    activeTier,
    unitPrice,
    discountPercent: activeTier.discountPercent,
    totalAmount,
    standardTotal,
    totalSavings,
    nextTier,
    unitsToNextTier,
  };
}

export function useBulkCalculator(product: Product | undefined, quantity: number): BulkCalculationResult | null {
  return useMemo(() => {
    if (!product) return null;
    return calculateBulkPricing(product, quantity);
  }, [product, quantity]);
}
