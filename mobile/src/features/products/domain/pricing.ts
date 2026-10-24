import { Product } from '@/features/products/domain/types/Product';

const MAX_DISCOUNT_PERCENTAGE = 100;

export const getOriginalPrice = (
  product: Pick<Product, 'price' | 'discountPercentage'>
): number | null => {
  const { price, discountPercentage } = product;
  if (
    !Number.isFinite(discountPercentage) ||
    discountPercentage <= 0 ||
    discountPercentage >= MAX_DISCOUNT_PERCENTAGE
  ) {
    return null;
  }
  return price / (1 - discountPercentage / MAX_DISCOUNT_PERCENTAGE);
};
