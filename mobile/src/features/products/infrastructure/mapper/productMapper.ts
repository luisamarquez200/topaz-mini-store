import { Product } from '@/features/products/domain/types/Product';
import { parseProductCategory } from '@/features/products/domain/types/ProductCategory';
import { ProductDto } from '@/features/products/infrastructure/dto/ProductDto';

export const mapProductDtoToDomain = (dto: ProductDto): Product => {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    category: parseProductCategory(dto.category),
    price: dto.price,
    discountPercentage: dto.discountPercentage,
    rating: dto.rating,
    stock: dto.stock,
    brand: dto.brand ?? null,
    thumbnail: dto.thumbnail,
    images: Array.isArray(dto.images) ? Object.freeze([...dto.images]) : Object.freeze([]),
  };
};
