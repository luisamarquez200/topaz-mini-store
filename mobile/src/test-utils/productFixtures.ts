import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';

export const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Essence Mascara',
  description: 'Lash Princess',
  category: ProductCategory.BEAUTY,
  price: 9.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 50,
  brand: 'Essence',
  thumbnail: 'https://example.com/thumb.jpg',
  images: Object.freeze(['https://example.com/1.jpg']),
  ...overrides,
});
