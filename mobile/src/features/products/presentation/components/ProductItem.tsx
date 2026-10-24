import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { STRINGS } from '@/core/theme/strings';
import { FavoriteButton } from '@/shared/components/FavoriteButton';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { formatCategoryLabel } from '@/features/products/presentation/utils/formatCategoryLabel';
import { formatPrice } from '@/features/products/presentation/utils/formatPrice';

const PRODUCT_IMAGE_SIZE = 96;
const IMAGE_TRANSITION_MS = 200;
const PRESSED_SCALE = 0.98;
const DEFAULT_SCALE = 1;
const SPRING_CONFIG = { damping: 15, stiffness: 300 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ProductItemProps {
  readonly product: Product;
  readonly onPress: (productId: number) => void;
  readonly rightAction?: React.ReactNode;
}

export const ProductItem: React.FC<ProductItemProps> = React.memo(
  ({ product, onPress, rightAction }) => {
    const scale = useSharedValue(DEFAULT_SCALE);

    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback((): void => {
      scale.value = withSpring(PRESSED_SCALE, SPRING_CONFIG);
    }, [scale]);

    const handlePressOut = useCallback((): void => {
      scale.value = withSpring(DEFAULT_SCALE, SPRING_CONFIG);
    }, [scale]);

    const handlePress = useCallback((): void => {
      onPress(product.id);
    }, [onPress, product.id]);

    const originalPrice =
      product.discountPercentage > 0
        ? product.price / (1 - product.discountPercentage / 100)
        : null;

    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, animatedCardStyle]}
        accessibilityRole="button"
        accessibilityLabel={product.title}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={IMAGE_TRANSITION_MS}
            accessibilityLabel={`${product.title}${STRINGS.products.thumbnailSuffix}`}
          />
          {product.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Typography variant="caption" color={COLORS.ink}>
                {`-${Math.round(product.discountPercentage)}%`}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Typography
            variant="caption"
            color={COLORS.muted}
            numberOfLines={1}
          >
            {formatCategoryLabel(product.category).toUpperCase()}
          </Typography>

          <Typography
            variant="subtitle"
            color={COLORS.ink}
            numberOfLines={2}
            style={styles.title}
          >
            {product.title}
          </Typography>

          <View style={styles.ratingRow}>
            <Typography variant="caption" color={COLORS.ink} style={styles.starText}>
              {STRINGS.products.starSymbol}
            </Typography>
            <Typography variant="caption" color={COLORS.muted} style={styles.ratingText}>
              {product.rating.toFixed(1)}
            </Typography>
          </View>

          <View style={styles.footer}>
            <View style={styles.pricePill}>
              <Typography
                variant="price"
                color={COLORS.surface}
                numberOfLines={1}
                style={styles.priceText}
              >
                {formatPrice(product.price)}
              </Typography>
            </View>
            {originalPrice !== null && (
              <Typography
                variant="caption"
                color={COLORS.subtle}
                numberOfLines={1}
                style={styles.originalPriceText}
              >
                {formatPrice(originalPrice)}
              </Typography>
            )}
          </View>
        </View>

        <View style={styles.actionContainer}>
          {rightAction ?? <FavoriteButton product={product} />}
        </View>
      </AnimatedPressable>
    );
  }
);

ProductItem.displayName = 'ProductItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: PRODUCT_IMAGE_SIZE,
    height: PRODUCT_IMAGE_SIZE,
    borderRadius: RADIUS.image,
    backgroundColor: COLORS.imageBackground,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.pill,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  title: {
    marginTop: SPACING.xxs,
    marginBottom: SPACING.xxs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
    marginBottom: SPACING.xs,
  },
  starText: {
    fontSize: 12,
    lineHeight: 14,
  },
  ratingText: {
    fontSize: 12,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  pricePill: {
    backgroundColor: COLORS.pillDark,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    alignSelf: 'flex-start',
  },
  priceText: {
    flexShrink: 0,
  },
  originalPriceText: {
    textDecorationLine: 'line-through',
    flexShrink: 0,
  },
  actionContainer: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
