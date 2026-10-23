import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { RootStackParamList } from '@/navigation/types';
import { CenteredState } from '@/shared/components/CenteredState';
import { ErrorView } from '@/shared/components/ErrorView';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Typography } from '@/shared/components/Typography';
import { ProductCarousel } from '@/features/products/presentation/components/ProductCarousel';
import { useProductDetail } from '@/features/products/presentation/hooks/useProductDetail';
import { formatPrice } from '@/features/products/presentation/utils/formatPrice';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export interface ProductDetailViewProps {
  readonly renderFavoriteButton?: (
    product: NonNullable<ReturnType<typeof useProductDetail>['data']>
  ) => React.ReactNode;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  renderFavoriteButton,
}) => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const { data: product, isLoading, error, refetch } = useProductDetail(productId);

  if (isLoading) {
    return (
      <CenteredState>
        <LoadingSpinner message={STRINGS.products.detailLoading} />
      </CenteredState>
    );
  }

  if (error !== null || product === null) {
    return (
      <CenteredState>
        <ErrorView
          title={STRINGS.products.detailErrorTitle}
          message={error ?? STRINGS.products.detailNotFoundMessage}
          onRetry={refetch}
        />
      </CenteredState>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProductCarousel images={product.images} />

      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Typography variant="caption" color={COLORS.accent}>
              {product.category.toUpperCase()}
            </Typography>
          </View>
          {renderFavoriteButton !== undefined && renderFavoriteButton(product)}
        </View>

        <Typography variant="heading" color={COLORS.text} style={styles.title}>
          {product.title}
        </Typography>

        {product.brand !== null && (
          <Typography
            variant="smBold"
            color={COLORS.textSecondary}
            style={styles.brand}
          >
            {STRINGS.products.brandPrefix}{product.brand}
          </Typography>
        )}

        <View style={styles.priceSection}>
          <View>
            <Typography variant="display" color={COLORS.primary}>
              {formatPrice(product.price)}
            </Typography>
            {product.discountPercentage > 0 && (
              <Typography variant="smBold" color={COLORS.success}>
                {product.discountPercentage.toFixed(0)}{STRINGS.products.offDiscount}
              </Typography>
            )}
          </View>

          <View style={styles.ratingBox}>
            <Typography variant="title" color={COLORS.topazGold}>
              {STRINGS.products.star}{product.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color={COLORS.textMuted}>
              {STRINGS.products.stockPrefix}{product.stock}
            </Typography>
          </View>
        </View>

        <View style={styles.divider} />

        <Typography
          variant="title"
          color={COLORS.primary}
          style={styles.sectionHeader}
        >
          {STRINGS.products.descriptionHeader}
        </Typography>
        <Typography
          variant="body"
          color={COLORS.textSecondary}
          style={styles.description}
        >
          {product.description}
        </Typography>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  detailsContainer: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.round,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  brand: {
    marginBottom: SPACING.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  ratingBox: {
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  description: {
    lineHeight: 24,
  },
});
