import { act, renderHook } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { useProductFilters } from '@/features/products/presentation/hooks/useProductFilters';

describe('useProductFilters', () => {
  const sampleProducts: readonly Product[] = [
    {
      id: 10,
      title: 'Crema Hidratante',
      description: 'Crema de día',
      category: ProductCategory.SKIN_CARE,
      price: 25.0,
      discountPercentage: 0,
      rating: 4.5,
      stock: 12,
      brand: 'Cerave',
      thumbnail: 'https://example.com/crema.jpg',
      images: ['https://example.com/crema.jpg'],
    },
    {
      id: 20,
      title: 'Perfume Noir',
      description: 'Fragancia intensa',
      category: ProductCategory.FRAGRANCES,
      price: 60.0,
      discountPercentage: 15,
      rating: 4.8,
      stock: 8,
      brand: 'Dior',
      thumbnail: 'https://example.com/perfume.jpg',
      images: ['https://example.com/perfume.jpg'],
    },
  ];

  it('should derive sorted unique categories with Todos first', async () => {
    // Arrange & Act
    const { result } = await renderHook(() =>
      useProductFilters(sampleProducts)
    );

    // Assert
    expect(result.current.categories).toEqual([
      STRINGS.filters.allCategories,
      ProductCategory.FRAGRANCES,
      ProductCategory.SKIN_CARE,
    ]);
  });

  it('should detect active filters and clear them with clearFilters', async () => {
    // Arrange
    const { result } = await renderHook(() =>
      useProductFilters(sampleProducts)
    );

    // Act
    await act(async () => {
      result.current.setQuery('perfume');
      result.current.setCategory(ProductCategory.FRAGRANCES);
    });

    // Assert
    expect(result.current.hasActiveFilters).toBe(true);

    // Act
    await act(async () => {
      result.current.clearFilters();
    });

    // Assert
    expect(result.current.query).toBe('');
    expect(result.current.category).toBe(STRINGS.filters.allCategories);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
