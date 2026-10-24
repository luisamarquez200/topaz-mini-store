import { useCallback, useMemo, useState } from 'react';
import { STRINGS } from '@/core/theme/strings';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import {
  filterProducts,
  SortOption,
} from '@/features/products/application/filterProducts';
import { Product } from '@/features/products/domain/types/Product';

export interface UseProductFiltersResult {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly category: string;
  readonly setCategory: (category: string) => void;
  readonly sort: SortOption;
  readonly setSort: (sort: SortOption) => void;
  readonly categories: readonly string[];
  readonly filteredProducts: readonly Product[];
  readonly hasActiveFilters: boolean;
  readonly clearFilters: () => void;
}

export const useProductFilters = (
  products: readonly Product[]
): UseProductFiltersResult => {
  const [query, setQuery] = useState<string>('');
  const [category, setCategory] = useState<string>(
    STRINGS.filters.allCategories
  );
  const [sort, setSort] = useState<SortOption>(SortOption.DEFAULT);

  const debouncedQuery = useDebouncedValue(query);

  const categories = useMemo<readonly string[]>(() => {
    const rawCategories = Array.from(
      new Set(products.map((product) => product.category))
    ).sort((a, b) => a.localeCompare(b));

    return [STRINGS.filters.allCategories, ...rawCategories];
  }, [products]);

  const filteredProducts = useMemo<readonly Product[]>(() => {
    const activeCategory =
      category === STRINGS.filters.allCategories ? undefined : category;

    return filterProducts(products, {
      query: debouncedQuery,
      category: activeCategory,
      sort,
    });
  }, [products, debouncedQuery, category, sort]);

  const hasActiveFilters = useMemo<boolean>(() => {
    const hasQuery = query.trim().length > 0;
    const hasCategory =
      category !== STRINGS.filters.allCategories && category.trim().length > 0;
    const hasSort = sort !== SortOption.DEFAULT;
    return hasQuery || hasCategory || hasSort;
  }, [query, category, sort]);

  const clearFilters = useCallback((): void => {
    setQuery('');
    setCategory(STRINGS.filters.allCategories);
    setSort(SortOption.DEFAULT);
  }, []);

  return {
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    categories,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
  };
};
