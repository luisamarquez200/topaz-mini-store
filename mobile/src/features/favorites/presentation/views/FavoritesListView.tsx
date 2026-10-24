import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { CenteredState } from '@/shared/components/CenteredState';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';
import { FavoriteButton } from '@/features/favorites/presentation/components/FavoriteButton';
import { useFavorites } from '@/features/favorites/presentation/hooks/useFavorites';

const INITIAL_NUM_TO_RENDER = 10;
const FAVORITE_BUTTON_SIZE = 36;

const keyExtractor = (item: Product): string => item.id.toString();

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

const EmptyFavoritesState: React.FC = () => (
  <CenteredState>
    <Typography
      variant="title"
      color={COLORS.text}
      align="center"
      style={styles.emptyTitle}
    >
      {STRINGS.favorites.emptyTitle}
    </Typography>
    <Typography
      variant="body"
      color={COLORS.textSecondary}
      align="center"
      style={styles.emptySubtitle}
    >
      {STRINGS.favorites.emptySubtitle}
    </Typography>
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
    return <EmptyFavoritesState />;
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
  },
  listContent: {
    paddingVertical: SPACING.lg,
  },
  separator: {
    height: SPACING.md,
  },
  emptyTitle: {
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    maxWidth: 280,
  },
});
