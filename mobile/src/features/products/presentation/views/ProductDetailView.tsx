import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
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
  readonly renderBottomAction?: (
    product: NonNullable<ReturnType<typeof useProductDetail>['data']>
  ) => React.ReactNode;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  renderFavoriteButton,
  renderBottomAction,
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

  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  const stockColor =
    product.stock > 10
      ? COLORS.success
      : product.stock > 0
      ? COLORS.warning
      : COLORS.error;

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselWrapper}>
          <ProductCarousel images={product.images} />
          {renderFavoriteButton !== undefined && (
            <View style={styles.floatingFavoriteButton}>
              {renderFavoriteButton(product)}
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.categoryBadge}>
            <Typography variant="caption" color={COLORS.accent}>
              {product.category.toUpperCase()}
            </Typography>
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
              <View style={styles.priceRow}>
                <Typography variant="display" color={COLORS.primary}>
                  {formatPrice(product.price)}
                </Typography>
                {originalPrice !== null && (
                  <Typography
                    variant="body"
                    color={COLORS.textMuted}
                    style={styles.originalPrice}
                  >
                    {formatPrice(originalPrice)}
                  </Typography>
                )}
              </View>

              {product.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                  <Typography variant="caption" color={COLORS.error}>
                    {`${product.discountPercentage.toFixed(0)}${STRINGS.products.offDiscount}`}
                  </Typography>
                </View>
              )}
            </View>

            <View style={styles.ratingAndStock}>
              <View style={styles.ratingBadge}>
                <Typography variant="title" color={COLORS.topazGold}>
                  {STRINGS.products.star}{product.rating.toFixed(1)}
                </Typography>
              </View>
              <View style={styles.stockBadge}>
                <Typography variant="caption" color={stockColor}>
                  {STRINGS.products.stockPrefix}{product.stock}
                </Typography>
              </View>
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

      {renderBottomAction !== undefined && (
        <View style={styles.bottomBar}>
          {renderBottomAction(product)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  carouselWrapper: {
    position: 'relative',
  },
  floatingFavoriteButton: {
    position: 'absolute',
    bottom: -20,
    right: SPACING.xl,
    zIndex: 10,
  },
  detailsContainer: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -SPACING.md,
    ...SHADOWS.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.xs,
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
    marginTop: SPACING.xxs,
  },
  ratingAndStock: {
    alignItems: 'flex-end',
    gap: SPACING.xxs,
  },
  ratingBadge: {
    backgroundColor: COLORS.topazGoldLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
  },
  stockBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
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
