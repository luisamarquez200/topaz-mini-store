import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { Product } from '@/features/products/domain/types/Product';

export class GetProductByIdUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async execute(id: number): Promise<Product | null> {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      return null;
    }
    return this.productRepository.getProductById(id);
  }
}
