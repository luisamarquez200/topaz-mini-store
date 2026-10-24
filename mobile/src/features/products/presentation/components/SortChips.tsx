import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { SortOption } from '@/features/products/application/filterProducts';

const SORT_ICON_SIZE = 16;
const CHIP_HEIGHT = 32;

export const SORT_OPTIONS: readonly {
  readonly value: SortOption;
  readonly label: string;
}[] = Object.freeze([
  { value: SortOption.DEFAULT, label: STRINGS.sort.default },
  { value: SortOption.PRICE_ASC, label: STRINGS.sort.priceAsc },
  { value: SortOption.PRICE_DESC, label: STRINGS.sort.priceDesc },
  { value: SortOption.RATING_DESC, label: STRINGS.sort.ratingDesc },
]);

export interface SortChipsProps {
  readonly selectedSort: SortOption;
  readonly onSelectSort: (sort: SortOption) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export const SortChips: React.FC<SortChipsProps> = ({
  selectedSort,
  onSelectSort,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      style={style}
      accessibilityRole="radiogroup"
      accessibilityLabel={STRINGS.sort.a11yLabel}
    >
      <View style={styles.iconWrapper}>
        <Ionicons
          name="swap-vertical"
          size={SORT_ICON_SIZE}
          color={COLORS.muted}
        />
      </View>
      {SORT_OPTIONS.map(({ value, label }) => {
        const isActive = value === selectedSort;
        return (
          <Pressable
            key={value}
            onPress={() => onSelectSort(value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isActive }}
            accessibilityLabel={label}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Typography
              variant={isActive ? 'smBold' : 'sm'}
              color={isActive ? COLORS.ink : COLORS.muted}
            >
              {label}
            </Typography>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xxs,
  },
  chip: {
    height: CHIP_HEIGHT,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    borderColor: COLORS.ink,
    backgroundColor: COLORS.surface,
  },
});
