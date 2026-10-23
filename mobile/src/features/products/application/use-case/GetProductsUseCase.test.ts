import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { GetProductsUseCase } from '@/features/products/application/use-case/GetProductsUseCase';

describe('GetProductsUseCase', () => {
  const SAMPLE_PRODUCT_ID = 1;
  const SAMPLE_TITLE = 'Essence Mascara';
  const SAMPLE_DESCRIPTION = 'Lash Princess';
  const SAMPLE_CATEGORY = ProductCategory.BEAUTY;
  const SAMPLE_PRICE = 9.99;
  const SAMPLE_DISCOUNT = 10.0;
  const SAMPLE_RATING = 4.5;
  const SAMPLE_STOCK = 50;
  const SAMPLE_BRAND = 'Essence';
  const SAMPLE_THUMBNAIL = 'https://example.com/thumb.jpg';
  const SAMPLE_IMAGES: readonly string[] = Object.freeze(['https://example.com/1.jpg']);
  const ERROR_MESSAGE = 'Network Error';

  const createSampleProduct = (id: number): Product => ({
    id,
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
  });

  it('should return product list on success', async () => {
    // Arrange
    const sampleProduct = createSampleProduct(SAMPLE_PRODUCT_ID);
    const mockRepo: IProductRepository = {
      getProducts: jest.fn().mockResolvedValue([sampleProduct]),
      getProductById: jest.fn().mockResolvedValue(sampleProduct),
    };
    const useCase = new GetProductsUseCase(mockRepo);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(sampleProduct);
    expect(mockRepo.getProducts).toHaveBeenCalledTimes(1);
  });

  it('should propagate error when repository rejects', async () => {
    // Arrange
    const mockRepo: IProductRepository = {
      getProducts: jest.fn().mockRejectedValue(new Error(ERROR_MESSAGE)),
      getProductById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetProductsUseCase(mockRepo);

    // Act & Assert
    await expect(useCase.execute()).rejects.toThrow(ERROR_MESSAGE);
    expect(mockRepo.getProducts).toHaveBeenCalledTimes(1);
  });
});
