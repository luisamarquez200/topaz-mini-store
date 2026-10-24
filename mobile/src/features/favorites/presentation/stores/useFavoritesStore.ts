import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/core/storage/mmkvStorage';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';

export const FAVORITES_STORAGE_VERSION = 1;

export interface FavoritesState {
  readonly favorites: readonly Product[];
  readonly add: (product: Product) => void;
  readonly remove: (productId: number) => void;
  readonly toggle: (product: Product) => void;
  readonly isFavorite: (productId: number) => boolean;
  readonly clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: Object.freeze([]),

      add: (product: Product): void => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.some((item) => item.id === product.id);
        if (exists) {
          return;
        }
        set({
          favorites: Object.freeze([...currentFavorites, product]),
        });
      },

      remove: (productId: number): void => {
        set({
          favorites: Object.freeze(
            get().favorites.filter((item) => item.id !== productId)
          ),
        });
      },

      toggle: (product: Product): void => {
        const exists = get().favorites.some((item) => item.id === product.id);
        if (exists) {
          get().remove(product.id);
        } else {
          get().add(product);
        }
      },

      isFavorite: (productId: number): boolean => {
        return get().favorites.some((item) => item.id === productId);
      },

      clear: (): void => {
        set({ favorites: Object.freeze([]) });
      },
    }),
    {
      name: STRINGS.favorites.storageName,
      version: FAVORITES_STORAGE_VERSION,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
