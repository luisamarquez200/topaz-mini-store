import { AxiosInstance } from 'axios';
import { ApiError } from '@/core/api/apiClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { ProductDto } from '@/features/products/infrastructure/dto/ProductDto';
import { ProductRepositoryImpl } from '@/features/products/infrastructure/repository/ProductRepositoryImpl';

const sampleDto: ProductDto = {
  id: 7,
  title: 'iPhone 9',
  description: 'Smartphone',
  category: 'smartphones',
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: 'Apple',
  thumbnail: 'https://example.com/thumb.jpg',
  images: ['https://example.com/1.jpg'],
};

const buildClient = (get: jest.Mock): AxiosInstance =>
  ({ get }) as unknown as AxiosInstance;

describe('ProductRepositoryImpl', () => {
  it('should fetch products and map them to domain entities', async () => {
    // Arrange
    const get = jest.fn().mockResolvedValue({ data: [sampleDto] });
    const repository = new ProductRepositoryImpl(buildClient(get));

    // Act
    const products = await repository.getProducts();

    // Assert
    expect(get).toHaveBeenCalledWith(ENDPOINTS.PRODUCTS);
    expect(products).toHaveLength(1);
    expect(products[0].category).toBe(ProductCategory.SMARTPHONES);
  });

  it('should return null when the product does not exist (404)', async () => {
    // Arrange
    const get = jest.fn().mockRejectedValue(new ApiError(404, 'not found'));
    const repository = new ProductRepositoryImpl(buildClient(get));

    // Act
    const product = await repository.getProductById(999);

    // Assert
    expect(get).toHaveBeenCalledWith(ENDPOINTS.PRODUCT_BY_ID(999));
    expect(product).toBeNull();
  });

  it('should rethrow errors other than 404', async () => {
    // Arrange
    const upstreamError = new ApiError(502, 'unavailable');
    const get = jest.fn().mockRejectedValue(upstreamError);
    const repository = new ProductRepositoryImpl(buildClient(get));

    // Act & Assert
    await expect(repository.getProductById(1)).rejects.toBe(upstreamError);
  });
});
