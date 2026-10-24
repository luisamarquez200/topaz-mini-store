import { Product } from '@/features/products/domain/types/Product';
import { formatCategoryLabel } from '@/features/products/application/formatCategoryLabel';

export enum SortOption {
  DEFAULT = 'DEFAULT',
  PRICE_ASC = 'PRICE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  RATING_DESC = 'RATING_DESC',
}

export interface FilterProductsCriteria {
  readonly query?: string;
  readonly category?: string;
  readonly sort?: SortOption;
}

export const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const filterProducts = (
  products: readonly Product[],
  criteria: FilterProductsCriteria
): Product[] => {
  const { query, category, sort = SortOption.DEFAULT } = criteria;
  const normalizedQuery = query !== undefined ? normalizeText(query) : '';
  const isAllCategories =
    category === undefined ||
    category.trim().length === 0 ||
    category.toLowerCase() === 'all' ||
    category.toLowerCase() === 'todos';

  const filtered = products.filter((product) => {
    if (!isAllCategories) {
      if (product.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
    }

    if (normalizedQuery.length > 0) {
      const titleNorm = normalizeText(product.title);
      const brandNorm =
        product.brand !== null ? normalizeText(product.brand) : '';
      const catNorm = normalizeText(product.category);
      const catTranslatedNorm = normalizeText(
        formatCategoryLabel(product.category)
      );

      const matches =
        titleNorm.includes(normalizedQuery) ||
        brandNorm.includes(normalizedQuery) ||
        catNorm.includes(normalizedQuery) ||
        catTranslatedNorm.includes(normalizedQuery);

      if (!matches) {
        return false;
      }
    }

    return true;
  });

  switch (sort) {
    case SortOption.PRICE_ASC:
      return [...filtered].sort((a, b) => a.price - b.price);
    case SortOption.PRICE_DESC:
      return [...filtered].sort((a, b) => b.price - a.price);
    case SortOption.RATING_DESC:
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case SortOption.DEFAULT:
    default:
      return filtered;
  }
};
