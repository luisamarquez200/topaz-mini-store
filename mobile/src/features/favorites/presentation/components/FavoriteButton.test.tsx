import React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { FavoriteButton } from '@/features/favorites/presentation/components/FavoriteButton';
import { useFavoritesStore } from '@/features/favorites/presentation/stores/useFavoritesStore';

describe('FavoriteButton', () => {
  const sampleProduct: Product = {
    id: 999,
    title: 'Topaz Mineral Water',
    description: 'Refreshing water',
    category: ProductCategory.GROCERIES,
    price: 3.5,
    discountPercentage: 0,
    rating: 5.0,
    stock: 100,
    brand: 'Topaz',
    thumbnail: 'https://example.com/water.jpg',
    images: ['https://example.com/water.jpg'],
  };

  beforeEach(() => {
    useFavoritesStore.getState().clear();
  });

  afterEach(() => {
    cleanup();
    useFavoritesStore.getState().clear();
  });

  it('should toggle favorite status and update accessibility labels when pressed', async () => {
    // Arrange
    const { getByRole } = await render(
      <FavoriteButton product={sampleProduct} />
    );
    const button = getByRole('button');

    // Assert initial state
    expect(button.props.accessibilityLabel).toBe(
      STRINGS.common.addFavoriteA11y
    );
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);

    // Act
    await act(async () => {
      fireEvent.press(button);
    });

    // Assert favorited
    expect(useFavoritesStore.getState().favorites).toHaveLength(1);
    expect(useFavoritesStore.getState().favorites[0].id).toBe(999);
    expect(button.props.accessibilityLabel).toBe(
      STRINGS.common.removeFavoriteA11y
    );

    // Act (toggle off)
    await act(async () => {
      fireEvent.press(button);
    });

    // Assert removed
    expect(useFavoritesStore.getState().favorites).toHaveLength(0);
    expect(button.props.accessibilityLabel).toBe(
      STRINGS.common.addFavoriteA11y
    );
  });
});
