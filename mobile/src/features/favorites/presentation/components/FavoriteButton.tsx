import React, { useCallback } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { useFavorites, useIsFavorite } from '@/features/favorites/presentation/hooks/useFavorites';

const DEFAULT_BUTTON_SIZE = 44;
const INITIAL_SCALE = 1;
const POP_SCALE = 1.3;
const POP_SPRING_CONFIG = { damping: 10, stiffness: 300 };
const RESET_SPRING_CONFIG = { damping: 12, stiffness: 200 };

export interface FavoriteButtonProps {
  readonly product: Product;
  readonly size?: number;
  readonly variant?: 'icon' | 'expanded';
  readonly style?: StyleProp<ViewStyle>;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = React.memo(
  ({ product, size = DEFAULT_BUTTON_SIZE, variant = 'icon', style }) => {
    const isFav = useIsFavorite(product.id);
    const { toggle } = useFavorites();
    const scale = useSharedValue(INITIAL_SCALE);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback((): void => {
      scale.value = withSequence(
        withSpring(POP_SCALE, POP_SPRING_CONFIG),
        withSpring(INITIAL_SCALE, RESET_SPRING_CONFIG)
      );
      try {
        void impactAsync(ImpactFeedbackStyle.Medium);
      } catch {
        // Fallback for non-native test environments
      }
      toggle(product);
    }, [product, scale, toggle]);

    if (variant === 'expanded') {
      const expandedContainerStyle: ViewStyle = {
        backgroundColor: isFav ? COLORS.favoriteLight : COLORS.accent,
        borderColor: isFav ? COLORS.favorite : COLORS.accent,
      };

      return (
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={
            isFav
              ? STRINGS.common.removeFavoriteA11y
              : STRINGS.common.addFavoriteA11y
          }
          style={styles.fullWidth}
        >
          <Animated.View
            style={[
              styles.expandedContainer,
              expandedContainerStyle,
              animatedStyle,
              style,
            ]}
          >
            <Typography
              variant="title"
              color={isFav ? COLORS.favorite : COLORS.surface}
            >
              {isFav
                ? STRINGS.favorites.favoriteIconFilled
                : STRINGS.favorites.favoriteIconEmpty}
            </Typography>
            <View style={styles.textSpacer} />
            <Typography
              variant="bodyBold"
              color={isFav ? COLORS.favorite : COLORS.surface}
            >
              {isFav
                ? STRINGS.favorites.removeFavoriteButton
                : STRINGS.favorites.addFavoriteButton}
            </Typography>
          </Animated.View>
        </Pressable>
      );
    }

    const dynamicContainerStyle: ViewStyle = {
      width: size,
      height: size,
      borderRadius: RADIUS.round,
      backgroundColor: isFav ? COLORS.favoriteLight : COLORS.surface,
      borderColor: isFav ? COLORS.favorite : COLORS.border,
    };

    return (
      <Pressable
        onPress={handlePress}
        hitSlop={{
          top: SPACING.sm,
          bottom: SPACING.sm,
          left: SPACING.sm,
          right: SPACING.sm,
        }}
        accessibilityRole="button"
        accessibilityLabel={
          isFav
            ? STRINGS.common.removeFavoriteA11y
            : STRINGS.common.addFavoriteA11y
        }
      >
        <Animated.View
          style={[
            styles.baseContainer,
            dynamicContainerStyle,
            animatedStyle,
            style,
          ]}
        >
          <Typography
            variant="title"
            color={isFav ? COLORS.favorite : COLORS.textMuted}
          >
            {isFav
              ? STRINGS.favorites.favoriteIconFilled
              : STRINGS.favorites.favoriteIconEmpty}
          </Typography>
        </Animated.View>
      </Pressable>
    );
  }
);

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  baseContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.md,
  },
  textSpacer: {
    width: SPACING.sm,
  },
});
