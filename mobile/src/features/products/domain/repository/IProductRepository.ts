import { Product } from '@/features/products/domain/types/Product';

export interface IProductRepository {
  getProducts(): Promise<readonly Product[]>;
  getProductById(id: number): Promise<Product | null>;
}
