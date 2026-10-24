import React, { useCallback } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { triggerHaptic } from '@/core/utils/haptics';
import { Typography } from '@/shared/components/Typography';
import { Product } from '@/features/products/domain/types/Product';
import { useFavoritesStore } from '@/features/favorites/presentation/stores/useFavoritesStore';

const DEFAULT_BUTTON_SIZE = 44;
const ICON_SIZE_RATIO = 0.52;
const INITIAL_SCALE = 1;
const POP_SCALE = 1.25;
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
    // Granular selector: returns primitive boolean so other list items never re-render
    const isFav = useFavoritesStore((state) =>
      state.favorites.some((item) => item.id === product.id)
    );
    const toggle = useFavoritesStore((state) => state.toggle);
    const scale = useSharedValue(INITIAL_SCALE);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = useCallback(
      (event: GestureResponderEvent): void => {
        event.stopPropagation();
        scale.value = withSequence(
          withSpring(POP_SCALE, POP_SPRING_CONFIG),
          withSpring(INITIAL_SCALE, RESET_SPRING_CONFIG)
        );
        triggerHaptic();
        toggle(product);
      },
      [product, scale, toggle]
    );

    if (variant === 'expanded') {
      return (
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={
            isFav
              ? STRINGS.common.removeFavoriteA11y
              : STRINGS.common.addFavoriteA11y
          }
          style={styles.expandedPressable}
        >
          <Animated.View
            style={[
              styles.expandedContainer,
              animatedStyle,
              style,
            ]}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={COLORS.ink}
            />
            <View style={styles.textSpacer} />
            <Typography
              variant="bodyBold"
              color={COLORS.ink}
              numberOfLines={1}
            >
              {isFav
                ? STRINGS.favorites.savedFavorite
                : STRINGS.favorites.saveFavorite}
            </Typography>
          </Animated.View>
        </Pressable>
      );
    }

    const dynamicContainerStyle: ViewStyle = {
      width: size,
      height: size,
      borderRadius: RADIUS.round,
      backgroundColor: isFav ? COLORS.ink : COLORS.surface,
      borderColor: isFav ? COLORS.ink : COLORS.border,
      borderWidth: 1,
    };

    const iconSize = Math.round(size * ICON_SIZE_RATIO);

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
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={isFav ? COLORS.surface : COLORS.ink}
          />
        </Animated.View>
      </Pressable>
    );
  }
);

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  expandedPressable: {
    flex: 1,
    minWidth: 0,
  },
  baseContainer: {
    minWidth: 44,
    minHeight: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  expandedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    minWidth: 0,
    width: '100%',
    ...SHADOWS.sm,
  },
  textSpacer: {
    width: SPACING.xs,
  },
});
