import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { ProductDto } from '@/features/products/infrastructure/dto/ProductDto';
import { mapProductDtoToDomain } from '@/features/products/infrastructure/mapper/productMapper';

describe('productMapper', () => {
  const SAMPLE_ID = 42;
  const SAMPLE_TITLE = 'Smart Tablet';
  const SAMPLE_DESCRIPTION = 'Ultra thin tablet';
  const KNOWN_CATEGORY = 'tablets';
  const UNKNOWN_CATEGORY = 'quantum-devices';
  const SAMPLE_PRICE = 499.99;
  const SAMPLE_DISCOUNT = 12.5;
  const SAMPLE_RATING = 4.7;
  const SAMPLE_STOCK = 25;
  const SAMPLE_BRAND = 'TopazTech';
  const SAMPLE_THUMBNAIL = 'https://example.com/tablet.png';
  const SAMPLE_IMAGES: readonly string[] = Object.freeze([
    'https://example.com/img1.png',
  ]);

  it('should map valid ProductDto to domain Product entity accurately', () => {
    // Arrange
    const dto: ProductDto = {
      id: SAMPLE_ID,
      title: SAMPLE_TITLE,
      description: SAMPLE_DESCRIPTION,
      category: KNOWN_CATEGORY,
      price: SAMPLE_PRICE,
      discountPercentage: SAMPLE_DISCOUNT,
      rating: SAMPLE_RATING,
      stock: SAMPLE_STOCK,
      brand: SAMPLE_BRAND,
      thumbnail: SAMPLE_THUMBNAIL,
      images: SAMPLE_IMAGES,
    };

    // Act
    const product = mapProductDtoToDomain(dto);

    // Assert
    expect(product.id).toBe(SAMPLE_ID);
    expect(product.title).toBe(SAMPLE_TITLE);
    expect(product.description).toBe(SAMPLE_DESCRIPTION);
    expect(product.category).toBe(ProductCategory.TABLETS);
    expect(product.price).toBe(SAMPLE_PRICE);
    expect(product.discountPercentage).toBe(SAMPLE_DISCOUNT);
    expect(product.rating).toBe(SAMPLE_RATING);
    expect(product.stock).toBe(SAMPLE_STOCK);
    expect(product.brand).toBe(SAMPLE_BRAND);
    expect(product.thumbnail).toBe(SAMPLE_THUMBNAIL);
    expect(product.images).toEqual(SAMPLE_IMAGES);
  });

  it('should fallback to ProductCategory.OTHER when category is unknown', () => {
    // Arrange
    const dto: ProductDto = {
      id: SAMPLE_ID,
      title: SAMPLE_TITLE,
      description: SAMPLE_DESCRIPTION,
      category: UNKNOWN_CATEGORY,
      price: SAMPLE_PRICE,
      discountPercentage: SAMPLE_DISCOUNT,
      rating: SAMPLE_RATING,
      stock: SAMPLE_STOCK,
      brand: SAMPLE_BRAND,
      thumbnail: SAMPLE_THUMBNAIL,
      images: SAMPLE_IMAGES,
    };

    // Act
    const product = mapProductDtoToDomain(dto);

    // Assert
    expect(product.category).toBe(ProductCategory.OTHER);
  });

  it('should handle null brand gracefully', () => {
    // Arrange
    const dto: ProductDto = {
      id: SAMPLE_ID,
      title: SAMPLE_TITLE,
      description: SAMPLE_DESCRIPTION,
      category: KNOWN_CATEGORY,
      price: SAMPLE_PRICE,
      discountPercentage: SAMPLE_DISCOUNT,
      rating: SAMPLE_RATING,
      stock: SAMPLE_STOCK,
      brand: null,
      thumbnail: SAMPLE_THUMBNAIL,
      images: SAMPLE_IMAGES,
    };

    // Act
    const product = mapProductDtoToDomain(dto);

    // Assert
    expect(product.brand).toBeNull();
  });
});
