import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { Product } from '@/features/products/domain/types/Product';

export class GetProductsUseCase {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async execute(): Promise<readonly Product[]> {
    return this.productRepository.getProducts();
  }
}
