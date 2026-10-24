import React, { useCallback, useMemo } from 'react';
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
import { CategoryChips } from '@/features/products/presentation/components/CategoryChips';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';
import { SearchBar } from '@/features/products/presentation/components/SearchBar';
import { SortChips } from '@/features/products/presentation/components/SortChips';
import { SearchEmptyState } from '@/features/products/presentation/components/SearchEmptyState';
import { useProductFilters } from '@/features/products/presentation/hooks/useProductFilters';
import { useProductList } from '@/features/products/presentation/hooks/useProductList';

const INITIAL_NUM_TO_RENDER = 10;

const keyExtractor = (item: Product): string => item.id.toString();

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

export interface ProductListViewProps {
  readonly renderItemAction?: (product: Product) => React.ReactNode;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
  renderItemAction,
}) => {
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = useProductList();
  const {
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
  } = useProductFilters(data);

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
        rightAction={renderItemAction?.(item)}
      />
    ),
    [handleProductPress, renderItemAction]
  );

  const listHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Typography
          variant="heading"
          color={COLORS.ink}
          style={styles.screenTitle}
        >
          {STRINGS.nav.productsTitle}
        </Typography>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          style={styles.searchBar}
        />
        <CategoryChips
          categories={categories}
          selectedCategory={category}
          onSelectCategory={setCategory}
          style={styles.categoryChips}
        />
        <SortChips
          selectedSort={sort}
          onSelectSort={setSort}
          style={styles.sortChips}
        />
      </View>
    ),
    [query, setQuery, category, setCategory, categories, sort, setSort]
  );

  const listEmpty = useMemo(() => {
    if (hasActiveFilters) {
      return <SearchEmptyState onClearFilters={clearFilters} />;
    }
    return (
      <CenteredState>
        <Typography variant="title" color={COLORS.ink} align="center">
          {STRINGS.products.emptyList}
        </Typography>
        <Typography
          variant="body"
          color={COLORS.muted}
          align="center"
          style={styles.emptySubtitle}
        >
          {STRINGS.products.placeholderCatalogSubtitle}
        </Typography>
      </CenteredState>
    );
  }, [hasActiveFilters, clearFilters]);

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
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={COLORS.ink}
            colors={[COLORS.ink]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingBottom: SPACING.sm,
  },
  screenTitle: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchBar: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  categoryChips: {
    marginBottom: SPACING.xs,
  },
  sortChips: {
    marginBottom: SPACING.xs,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  separator: {
    height: SPACING.md,
  },
  emptySubtitle: {
    marginTop: SPACING.xs,
  },
});
