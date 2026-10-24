import { formatPrice } from '@/features/products/presentation/utils/formatPrice';

describe('formatPrice', () => {
  it('should format prices as USD with two decimals and thousands separator', () => {
    expect(formatPrice(9.99)).toBe('$9.99');
    expect(formatPrice(1234.5)).toBe('$1,234.50');
  });

  it('should fall back to zero for non-finite values', () => {
    expect(formatPrice(Number.NaN)).toBe('$0.00');
    expect(formatPrice(Number.POSITIVE_INFINITY)).toBe('$0.00');
  });
});
