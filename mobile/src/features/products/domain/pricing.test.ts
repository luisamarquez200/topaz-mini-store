import { getOriginalPrice } from '@/features/products/domain/pricing';

describe('getOriginalPrice', () => {
  it('should compute the price before discount', () => {
    // Arrange & Act
    const original = getOriginalPrice({ price: 80, discountPercentage: 20 });

    // Assert
    expect(original).toBeCloseTo(100);
  });

  it.each([0, -5, 100, 150, Number.NaN])(
    'should return null for invalid discount %p',
    (discountPercentage) => {
      expect(getOriginalPrice({ price: 50, discountPercentage })).toBeNull();
    }
  );
});
