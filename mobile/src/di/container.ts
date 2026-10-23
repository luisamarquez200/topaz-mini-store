import { apiClient } from '@/core/api/apiClient';
import { GetProductByIdUseCase } from '@/features/products/application/use-case/GetProductByIdUseCase';
import { GetProductsUseCase } from '@/features/products/application/use-case/GetProductsUseCase';
import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { ProductRepositoryImpl } from '@/features/products/infrastructure/repository/ProductRepositoryImpl';

export interface AppContainer {
  readonly productRepository: IProductRepository;
  readonly getProductsUseCase: GetProductsUseCase;
  readonly getProductByIdUseCase: GetProductByIdUseCase;
}

class Container implements AppContainer {
  public readonly productRepository: IProductRepository;
  public readonly getProductsUseCase: GetProductsUseCase;
  public readonly getProductByIdUseCase: GetProductByIdUseCase;

  constructor() {
    this.productRepository = new ProductRepositoryImpl(apiClient);
    this.getProductsUseCase = new GetProductsUseCase(this.productRepository);
    this.getProductByIdUseCase = new GetProductByIdUseCase(
      this.productRepository
    );
  }
}

export const container: AppContainer = new Container();
