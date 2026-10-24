import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { useFavoritesStore } from '@/features/favorites/presentation/stores/useFavoritesStore';
import { FavoritesListView } from '@/features/favorites/presentation/views/FavoritesListView';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('FavoritesListView', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useFavoritesStore.getState().clear();
  });

  it('should render empty state with title, subtitle and explore button when empty', async () => {
    // Arrange & Act
    const { getByText } = await render(<FavoritesListView />);

    // Assert
    expect(getByText(STRINGS.favorites.emptyTitle)).toBeTruthy();
    expect(getByText(STRINGS.favorites.emptySubtitle)).toBeTruthy();
    expect(getByText(STRINGS.favorites.exploreButton)).toBeTruthy();
  });

  it('should navigate to ProductsTab when explore button is pressed', async () => {
    // Arrange
    const { getByText } = await render(<FavoritesListView />);

    // Act
    const exploreButton = getByText(STRINGS.favorites.exploreButton);
    fireEvent.press(exploreButton);

    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('MainTabs', {
      screen: 'ProductsTab',
    });
  });
});
