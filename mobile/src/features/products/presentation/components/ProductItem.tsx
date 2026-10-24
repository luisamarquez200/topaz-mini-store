import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { formatPrice } from '@/features/products/presentation/utils/formatPrice';

const THUMBNAIL_SIZE = 88;
const IMAGE_TRANSITION_MS = 200;

export interface ProductItemProps {
  readonly product: Product;
  readonly onPress: (productId: number) => void;
  readonly rightAction?: React.ReactNode;
}

export const ProductItem: React.FC<ProductItemProps> = React.memo(
  ({ product, onPress, rightAction }) => {
    const handlePress = (): void => {
      onPress(product.id);
    };

    return (
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          pressed ? styles.pressed : null,
        ]}
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
              <Typography variant="caption" color={COLORS.error}>
                {`-${Math.round(product.discountPercentage)}%`}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.categoryRow}>
            <Typography
              variant="caption"
              color={COLORS.accent}
              numberOfLines={1}
            >
              {product.category.toUpperCase()}
            </Typography>
          </View>

          <Typography
            variant="subtitle"
            color={COLORS.text}
            numberOfLines={2}
            style={styles.title}
          >
            {product.title}
          </Typography>

          <View style={styles.footer}>
            <Typography variant="title" color={COLORS.primary}>
              {formatPrice(product.price)}
            </Typography>
            <View style={styles.ratingBadge}>
              <Typography variant="smBold" color={COLORS.topazGold}>
                {STRINGS.products.star}{product.rating.toFixed(1)}
              </Typography>
            </View>
          </View>
        </View>

        {rightAction !== undefined && (
          <View style={styles.actionContainer}>{rightAction}</View>
        )}
      </Pressable>
    );
  }
);

ProductItem.displayName = 'ProductItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  imageWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginVertical: SPACING.xxs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  ratingBadge: {
    backgroundColor: COLORS.topazGoldLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: RADIUS.xs,
  },
  actionContainer: {
    marginLeft: SPACING.sm,
  },
});
