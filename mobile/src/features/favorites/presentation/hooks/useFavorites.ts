import { useCallback } from 'react';
import { Product } from '@/features/products/domain/types/Product';
import { useFavoritesStore } from '@/features/favorites/presentation/stores/useFavoritesStore';

export interface UseFavoritesResult {
  readonly favorites: readonly Product[];
  readonly add: (product: Product) => void;
  readonly remove: (productId: number) => void;
  readonly toggle: (product: Product) => void;
  readonly isFavorite: (productId: number) => boolean;
  readonly isEmpty: boolean;
  readonly totalCount: number;
}

export const useFavorites = (): UseFavoritesResult => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const add = useFavoritesStore((state) => state.add);
  const remove = useFavoritesStore((state) => state.remove);
  const toggle = useFavoritesStore((state) => state.toggle);

  const isFavorite = useCallback(
    (productId: number): boolean => {
      return favorites.some((item) => item.id === productId);
    },
    [favorites]
  );

  return {
    favorites,
    add,
    remove,
    toggle,
    isFavorite,
    isEmpty: favorites.length === 0,
    totalCount: favorites.length,
  };
};

export const useIsFavorite = (productId: number): boolean => {
  return useFavoritesStore((state) =>
    state.favorites.some((item) => item.id === productId)
  );
};

export const useFavoritesCount = (): number => {
  return useFavoritesStore((state) => state.favorites.length);
};
