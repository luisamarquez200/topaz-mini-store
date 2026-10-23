import { ProductCategory } from './ProductCategory';

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly discountPercentage: number;
  readonly rating: number;
  readonly stock: number;
  readonly brand: string | null;
  readonly thumbnail: string;
  readonly images: readonly string[];
}
