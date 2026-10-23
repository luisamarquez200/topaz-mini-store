import { AxiosInstance } from 'axios';
import { ENDPOINTS } from '@/core/api/endpoints';
import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { Product } from '@/features/products/domain/types/Product';
import { ProductDto } from '@/features/products/infrastructure/dto/ProductDto';
import { mapProductDtoToDomain } from '@/features/products/infrastructure/mapper/productMapper';

export class ProductRepositoryImpl implements IProductRepository {
  private readonly client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  public async getProducts(): Promise<readonly Product[]> {
    const response = await this.client.get<readonly ProductDto[]>(
      ENDPOINTS.PRODUCTS
    );
    return response.data.map(mapProductDtoToDomain);
  }

  public async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.client.get<ProductDto>(
        ENDPOINTS.PRODUCT_BY_ID(id)
      );
      return mapProductDtoToDomain(response.data);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 404
      ) {
        return null;
      }
      throw error;
    }
  }
}
