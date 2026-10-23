import { renderHook, waitFor } from '@testing-library/react-native';
import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { GetProductsUseCase } from '@/features/products/application/use-case/GetProductsUseCase';
import { useProductList } from '@/features/products/presentation/hooks/useProductList';

describe('useProductList', () => {
  const SAMPLE_PRODUCT_ID = 10;
  const SAMPLE_TITLE = 'Lipstick Matte';
  const SAMPLE_DESCRIPTION = 'Long lasting matte lipstick';
  const SAMPLE_CATEGORY = ProductCategory.BEAUTY;
  const SAMPLE_PRICE = 14.5;
  const SAMPLE_DISCOUNT = 5.0;
  const SAMPLE_RATING = 4.2;
  const SAMPLE_STOCK = 100;
  const SAMPLE_BRAND = 'LipGlam';
  const SAMPLE_THUMBNAIL = 'https://example.com/lip.jpg';
  const SAMPLE_IMAGES: readonly string[] = Object.freeze(['https://example.com/1.jpg']);
  const ERROR_MSG = 'Network timeout occurred';

  const sampleProduct: Product = {
    id: SAMPLE_PRODUCT_ID,
    title: SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
    category: SAMPLE_CATEGORY,
    price: SAMPLE_PRICE,
    discountPercentage: SAMPLE_DISCOUNT,
    rating: SAMPLE_RATING,
    stock: SAMPLE_STOCK,
    brand: SAMPLE_BRAND,
    thumbnail: SAMPLE_THUMBNAIL,
    images: SAMPLE_IMAGES,
  };

  it('should initialize with loading state', async () => {
    // Arrange
    const mockRepo: IProductRepository = {
      getProducts: jest.fn().mockImplementation(() => new Promise(() => {})),
      getProductById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetProductsUseCase(mockRepo);

    // Act
    const { result } = await renderHook(() => useProductList(useCase));

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should transition to success state when products are fetched', async () => {
    // Arrange
    const mockRepo: IProductRepository = {
      getProducts: jest.fn().mockResolvedValue([sampleProduct]),
      getProductById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetProductsUseCase(mockRepo);

    // Act
    const { result } = await renderHook(() => useProductList(useCase));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0]).toEqual(sampleProduct);
    expect(result.current.error).toBeNull();
  });

  it('should transition to error state when useCase rejects', async () => {
    // Arrange
    const mockRepo: IProductRepository = {
      getProducts: jest.fn().mockRejectedValue(new Error(ERROR_MSG)),
      getProductById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetProductsUseCase(mockRepo);

    // Act
    const { result } = await renderHook(() => useProductList(useCase));

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBe(ERROR_MSG);
  });
});
