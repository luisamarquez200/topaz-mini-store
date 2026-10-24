import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { STRINGS } from '@/core/theme/strings';
import { CenteredState } from '@/shared/components/CenteredState';
import { ErrorView } from '@/shared/components/ErrorView';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Typography } from '@/shared/components/Typography';
import { getOriginalPrice } from '@/features/products/domain/pricing';
import { ProductCarousel } from '@/features/products/presentation/components/ProductCarousel';
import { useProductDetail } from '@/features/products/presentation/hooks/useProductDetail';
import { formatCategoryLabel } from '@/features/products/application/formatCategoryLabel';
import { formatPrice } from '@/features/products/presentation/utils/formatPrice';
import { RootStackParamList } from '@/navigation/types';

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
  const insets = useSafeAreaInsets();
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProductDetail(productId);

  if (isLoading) {
    return (
      <CenteredState>
        <LoadingSpinner message={STRINGS.products.detailLoading} />
      </CenteredState>
    );
  }

  if (error !== null) {
    return (
      <CenteredState>
        <ErrorView
          title={STRINGS.products.detailErrorTitle}
          message={error}
          onRetry={refetch}
        />
      </CenteredState>
    );
  }

  if (product === null) {
    return (
      <CenteredState>
        <ErrorView
          title={STRINGS.products.detailErrorTitle}
          message={STRINGS.products.detailNotFoundMessage}
          onRetry={refetch}
        />
      </CenteredState>
    );
  }

  const originalPrice = getOriginalPrice(product);

  const bottomInset = Math.max(insets.bottom, SPACING.sm);

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselCard}>
          <ProductCarousel images={product.images} />
          {renderFavoriteButton !== undefined && (
            <View style={styles.floatingFavoriteButton}>
              {renderFavoriteButton(product)}
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.metaRow}>
            <View style={styles.categoryChip}>
              <Typography variant="caption" color={COLORS.muted}>
                {formatCategoryLabel(product.category).toUpperCase()}
              </Typography>
            </View>

            <View style={styles.ratingRow}>
              <Typography
                variant="caption"
                color={COLORS.ink}
                style={styles.starText}
              >
                {STRINGS.products.starSymbol}
              </Typography>
              <Typography
                variant="caption"
                color={COLORS.muted}
                style={styles.ratingText}
              >
                {product.rating.toFixed(1)}
              </Typography>
            </View>
          </View>

          <Typography variant="heading" color={COLORS.ink} style={styles.title}>
            {product.title}
          </Typography>

          {product.brand !== null && (
            <Typography
              variant="sm"
              color={COLORS.textSecondary}
              style={styles.brand}
            >
              {STRINGS.products.brandPrefix}
              {product.brand}
            </Typography>
          )}

          <View style={styles.stockRow}>
            {product.stock > 0 ? (
              <Typography variant="caption" color={COLORS.muted}>
                {STRINGS.products.stockPrefix}
                {product.stock}
              </Typography>
            ) : (
              <Typography variant="caption" color={COLORS.danger}>
                {STRINGS.products.outOfStock}
              </Typography>
            )}
            {product.discountPercentage > 0 && (
              <View style={styles.discountBadge}>
                <Typography variant="caption" color={COLORS.ink}>
                  {`-${Math.round(product.discountPercentage)}%`}
                </Typography>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <Typography
            variant="title"
            color={COLORS.ink}
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

      {/* Fixed bottom bar with price and action button */}
      <View style={[styles.bottomBarWrapper, { paddingBottom: bottomInset }]}>
        <View style={styles.bottomPill}>
          <View style={styles.bottomPriceCol}>
            <Typography
              variant="title"
              color={COLORS.surface}
              numberOfLines={1}
            >
              {formatPrice(product.price)}
            </Typography>
            {originalPrice !== null && (
              <Typography
                variant="caption"
                color={COLORS.pillDarkInactiveText}
                numberOfLines={1}
                style={styles.originalPriceText}
              >
                {formatPrice(originalPrice)}
              </Typography>
            )}
          </View>

          <View style={styles.bottomActionSlot}>
            {renderBottomAction !== undefined && renderBottomAction(product)}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  carouselCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
    ...SHADOWS.card,
  },
  floatingFavoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
  },
  detailsCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  categoryChip: {
    backgroundColor: COLORS.imageBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.pill,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  starText: {
    fontSize: 12,
    lineHeight: 14,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 14,
  },
  title: {
    marginTop: SPACING.xxs,
  },
  brand: {
    marginTop: SPACING.xxs,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  discountBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.pill,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionHeader: {
    marginBottom: SPACING.xs,
  },
  description: {
    lineHeight: 22,
  },
  bottomBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: SPACING.md,
    right: SPACING.md,
    paddingTop: SPACING.xs,
    backgroundColor: 'transparent',
  },
  bottomPill: {
    backgroundColor: COLORS.pillDark,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  bottomPriceCol: {
    justifyContent: 'center',
    flexShrink: 0,
  },
  originalPriceText: {
    textDecorationLine: 'line-through',
  },
  bottomActionSlot: {
    flex: 1,
    minWidth: 0,
  },
});
