import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Button } from '@/shared/components/Button';
import { CenteredState } from '@/shared/components/CenteredState';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';
import { FavoriteButton } from '@/features/favorites/presentation/components/FavoriteButton';
import { useFavorites } from '@/features/favorites/presentation/hooks/useFavorites';

const INITIAL_NUM_TO_RENDER = 10;
const FAVORITE_BUTTON_SIZE = 44;
const EMPTY_HEART_ICON_SIZE = 56;

const keyExtractor = (item: Product): string => item.id.toString();

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

interface EmptyFavoritesProps {
  readonly onExplore: () => void;
}

const EmptyFavoritesState: React.FC<EmptyFavoritesProps> = ({ onExplore }) => (
  <CenteredState style={styles.emptyContainer}>
    <Ionicons
      name="heart-outline"
      size={EMPTY_HEART_ICON_SIZE}
      color={COLORS.muted}
      style={styles.emptyIcon}
    />
    <Typography
      variant="title"
      color={COLORS.ink}
      align="center"
      style={styles.emptyTitle}
    >
      {STRINGS.favorites.emptyTitle}
    </Typography>
    <Typography
      variant="body"
      color={COLORS.muted}
      align="center"
      style={styles.emptySubtitle}
    >
      {STRINGS.favorites.emptySubtitle}
    </Typography>
    <Button
      title={STRINGS.favorites.exploreButton}
      onPress={onExplore}
      variant="primary"
      style={styles.exploreButton}
    />
  </CenteredState>
);

export const FavoritesListView: React.FC = () => {
  const navigation = useNavigation();
  const { favorites, isEmpty } = useFavorites();

  const handleProductPress = useCallback(
    (productId: number): void => {
      navigation.navigate('ProductDetail', { productId });
    },
    [navigation]
  );

  const handleExplore = useCallback((): void => {
    navigation.navigate('MainTabs', { screen: 'ProductsTab' });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <ProductItem
        product={item}
        onPress={handleProductPress}
        rightAction={<FavoriteButton product={item} size={FAVORITE_BUTTON_SIZE} />}
      />
    ),
    [handleProductPress]
  );

  if (isEmpty) {
    return <EmptyFavoritesState onExplore={handleExplore} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingVertical: SPACING.lg,
  },
  separator: {
    height: SPACING.md,
  },
  emptyContainer: {
    backgroundColor: COLORS.background,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    maxWidth: 280,
    marginBottom: SPACING.xl,
  },
  exploreButton: {
    minWidth: 180,
  },
});
