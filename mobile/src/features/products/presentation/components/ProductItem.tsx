import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { formatPrice } from '@/features/products/presentation/utils/formatPrice';

const THUMBNAIL_SIZE = 84;

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
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
          accessibilityLabel={`${product.title}${STRINGS.products.thumbnailSuffix}`}
        />
        <View style={styles.info}>
          <Typography
            variant="caption"
            color={COLORS.accent}
            numberOfLines={1}
          >
            {product.category.toUpperCase()}
          </Typography>
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
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: COLORS.surfaceMuted,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
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
