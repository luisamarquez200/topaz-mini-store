import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { Product } from '@/features/products/domain/types/Product';
import { useFavoritesStore } from '@/features/favorites/presentation/stores/useFavoritesStore';

describe('useFavoritesStore', () => {
  const PRODUCT_A_ID = 1;
  const PRODUCT_A_TITLE = 'Essence Mascara';
  const PRODUCT_A_DESCRIPTION = 'Lash Princess False Lash Effect';
  const PRODUCT_A_PRICE = 9.99;
  const PRODUCT_A_DISCOUNT = 7.17;
  const PRODUCT_A_RATING = 4.94;
  const PRODUCT_A_STOCK = 5;
  const PRODUCT_A_BRAND = 'Essence';
  const PRODUCT_A_THUMBNAIL = 'https://example.com/mascara.png';
  const PRODUCT_A_IMAGES: readonly string[] = Object.freeze(['https://example.com/mascara-1.png']);

  const PRODUCT_B_ID = 2;
  const PRODUCT_B_TITLE = 'Eyeshadow Palette';
  const PRODUCT_B_DESCRIPTION = 'Multi-color eyeshadow';
  const PRODUCT_B_PRICE = 19.99;
  const PRODUCT_B_DISCOUNT = 5.5;
  const PRODUCT_B_RATING = 4.3;
  const PRODUCT_B_STOCK = 15;
  const PRODUCT_B_BRAND = 'Glamour';
  const PRODUCT_B_THUMBNAIL = 'https://example.com/eyeshadow.png';
  const PRODUCT_B_IMAGES: readonly string[] = Object.freeze(['https://example.com/eyeshadow-1.png']);

  const NON_EXISTENT_PRODUCT_ID = 999;

  const sampleProductA: Product = {
    id: PRODUCT_A_ID,
    title: PRODUCT_A_TITLE,
    description: PRODUCT_A_DESCRIPTION,
    category: ProductCategory.BEAUTY,
    price: PRODUCT_A_PRICE,
    discountPercentage: PRODUCT_A_DISCOUNT,
    rating: PRODUCT_A_RATING,
    stock: PRODUCT_A_STOCK,
    brand: PRODUCT_A_BRAND,
    thumbnail: PRODUCT_A_THUMBNAIL,
    images: PRODUCT_A_IMAGES,
  };

  const sampleProductB: Product = {
    id: PRODUCT_B_ID,
    title: PRODUCT_B_TITLE,
    description: PRODUCT_B_DESCRIPTION,
    category: ProductCategory.BEAUTY,
    price: PRODUCT_B_PRICE,
    discountPercentage: PRODUCT_B_DISCOUNT,
    rating: PRODUCT_B_RATING,
    stock: PRODUCT_B_STOCK,
    brand: PRODUCT_B_BRAND,
    thumbnail: PRODUCT_B_THUMBNAIL,
    images: PRODUCT_B_IMAGES,
  };

  beforeEach(() => {
    useFavoritesStore.getState().clear();
  });

  it('should initialize with an empty favorites array', () => {
    // Arrange & Act
    const state = useFavoritesStore.getState();

    // Assert
    expect(state.favorites).toEqual([]);
    expect(state.favorites.length).toBe(0);
  });

  it('should add a product to favorites correctly', () => {
    // Arrange
    const { add } = useFavoritesStore.getState();

    // Act
    add(sampleProductA);

    // Assert
    const updated = useFavoritesStore.getState();
    expect(updated.favorites).toHaveLength(1);
    expect(updated.favorites[0]).toEqual(sampleProductA);
    expect(updated.isFavorite(PRODUCT_A_ID)).toBe(true);
  });

  it('should prevent duplicate products from being added', () => {
    // Arrange
    const { add } = useFavoritesStore.getState();

    // Act
    add(sampleProductA);
    add(sampleProductA);

    // Assert
    const updated = useFavoritesStore.getState();
    expect(updated.favorites).toHaveLength(1);
  });

  it('should remove a product by its id', () => {
    // Arrange
    const { add, remove } = useFavoritesStore.getState();
    add(sampleProductA);
    add(sampleProductB);

    // Act
    remove(PRODUCT_A_ID);

    // Assert
    const updated = useFavoritesStore.getState();
    expect(updated.favorites).toHaveLength(1);
    expect(updated.favorites[0].id).toBe(PRODUCT_B_ID);
    expect(updated.isFavorite(PRODUCT_A_ID)).toBe(false);
    expect(updated.isFavorite(PRODUCT_B_ID)).toBe(true);
  });

  it('should toggle product: add when absent and remove when present', () => {
    // Arrange
    const { toggle } = useFavoritesStore.getState();

    // Act 1: Toggle absent product (adds it)
    toggle(sampleProductA);

    // Assert 1
    let state = useFavoritesStore.getState();
    expect(state.isFavorite(PRODUCT_A_ID)).toBe(true);
    expect(state.favorites).toHaveLength(1);

    // Act 2: Toggle present product (removes it)
    toggle(sampleProductA);

    // Assert 2
    state = useFavoritesStore.getState();
    expect(state.isFavorite(PRODUCT_A_ID)).toBe(false);
    expect(state.favorites).toHaveLength(0);
  });

  it('should return false for isFavorite when product is not in store', () => {
    // Arrange
    const { add, isFavorite } = useFavoritesStore.getState();
    add(sampleProductA);

    // Act
    const result = isFavorite(NON_EXISTENT_PRODUCT_ID);

    // Assert
    expect(result).toBe(false);
  });
});
