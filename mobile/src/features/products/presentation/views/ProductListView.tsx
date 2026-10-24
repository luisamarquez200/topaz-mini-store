import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { CenteredState } from '@/shared/components/CenteredState';
import { ErrorView } from '@/shared/components/ErrorView';
import { ProductListSkeleton } from '@/shared/components/ProductCardSkeleton';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';
import { useProductList } from '@/features/products/presentation/hooks/useProductList';

const INITIAL_NUM_TO_RENDER = 10;

const keyExtractor = (item: Product): string => item.id.toString();

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

const EmptyList: React.FC = () => (
  <CenteredState>
    <Typography variant="title" color={COLORS.text} align="center">
      {STRINGS.products.emptyList}
    </Typography>
    <Typography
      variant="body"
      color={COLORS.textSecondary}
      align="center"
      style={styles.emptySubtitle}
    >
      {STRINGS.products.placeholderCatalogSubtitle}
    </Typography>
  </CenteredState>
);

export const ProductListView: React.FC = () => {
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = useProductList();

  const handleProductPress = useCallback(
    (productId: number): void => {
      navigation.navigate('ProductDetail', { productId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Product>) => (
      <ProductItem product={item} onPress={handleProductPress} />
    ),
    [handleProductPress]
  );

  if (isLoading && data.length === 0) {
    return <ProductListSkeleton />;
  }

  if (error !== null && data.length === 0) {
    return (
      <CenteredState>
        <ErrorView
          title={STRINGS.products.errorTitle}
          message={error}
          onRetry={refetch}
        />
      </CenteredState>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={styles.listContent}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
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
  emptySubtitle: {
    marginTop: SPACING.xs,
  },
});
