import {
  filterProducts,
  SortOption,
} from '@/features/products/application/filterProducts';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';

describe('filterProducts', () => {
  const productA: Product = {
    id: 1,
    title: 'Café Colombiano Molido',
    description: 'Café gourmet de origen',
    category: ProductCategory.GROCERIES,
    price: 15.0,
    discountPercentage: 0,
    rating: 4.8,
    stock: 20,
    brand: 'Juan Valdez',
    thumbnail: 'https://example.com/cafe.jpg',
    images: ['https://example.com/cafe.jpg'],
  };

  const productB: Product = {
    id: 2,
    title: 'Serum Facial Hidratante',
    description: 'Ácido hialurónico puro',
    category: ProductCategory.SKIN_CARE,
    price: 35.0,
    discountPercentage: 10,
    rating: 4.2,
    stock: 5,
    brand: 'LOréal',
    thumbnail: 'https://example.com/serum.jpg',
    images: ['https://example.com/serum.jpg'],
  };

  const productC: Product = {
    id: 3,
    title: 'Labial Mate Larga Duración',
    description: 'Labial mate rojo',
    category: ProductCategory.BEAUTY,
    price: 8.5,
    discountPercentage: 5,
    rating: 4.9,
    stock: 50,
    brand: 'Maybelline',
    thumbnail: 'https://example.com/labial.jpg',
    images: ['https://example.com/labial.jpg'],
  };

  const productList: readonly Product[] = [productA, productB, productC];

  it('should filter products ignoring accents and casing in search query', () => {
    // Arrange
    const query = 'cafe';

    // Act
    const result = filterProducts(productList, { query });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('should filter by brand case-insensitively', () => {
    // Arrange
    const query = 'maybelline';

    // Act
    const result = filterProducts(productList, { query });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it('should filter by category when category filter is selected', () => {
    // Arrange
    const category = ProductCategory.SKIN_CARE;

    // Act
    const result = filterProducts(productList, { category });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('should combine search query and category filters', () => {
    // Arrange
    const query = 'hidra';
    const category = ProductCategory.SKIN_CARE;

    // Act
    const result = filterProducts(productList, { query, category });

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('should return empty list when no products match criteria', () => {
    // Arrange
    const query = 'Inexistente';

    // Act
    const result = filterProducts(productList, { query });

    // Assert
    expect(result).toHaveLength(0);
  });

  it('should return all products when query is empty and category is all', () => {
    // Arrange
    const category = 'Todos';

    // Act
    const result = filterProducts(productList, { category });

    // Assert
    expect(result).toHaveLength(3);
  });

  it('should sort products by price ascending correctly', () => {
    // Arrange
    const sort = SortOption.PRICE_ASC;

    // Act
    const result = filterProducts(productList, { sort });

    // Assert
    expect(result.map((p) => p.price)).toEqual([8.5, 15.0, 35.0]);
  });

  it('should sort products by rating descending correctly', () => {
    // Arrange
    const sort = SortOption.RATING_DESC;

    // Act
    const result = filterProducts(productList, { sort });

    // Assert
    expect(result.map((p) => p.rating)).toEqual([4.9, 4.8, 4.2]);
  });
});
