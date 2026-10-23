import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { CenteredState } from '@/shared/components/CenteredState';
import { ErrorView } from '@/shared/components/ErrorView';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Product } from '@/features/products/domain/types/Product';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';
import { useProductList } from '@/features/products/presentation/hooks/useProductList';

const INITIAL_NUM_TO_RENDER = 10;

const keyExtractor = (item: Product): string => item.id.toString();

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

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

  if (isLoading) {
    return (
      <CenteredState>
        <LoadingSpinner message={STRINGS.products.loading} />
      </CenteredState>
    );
  }

  if (error !== null) {
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
});
