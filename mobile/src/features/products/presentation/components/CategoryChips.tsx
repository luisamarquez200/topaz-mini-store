import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { formatCategoryLabel } from '@/features/products/presentation/utils/formatCategoryLabel';

export interface CategoryChipsProps {
  readonly categories: readonly string[];
  readonly selectedCategory: string;
  readonly onSelectCategory: (category: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  style,
}) => {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      const isActive = item === selectedCategory;
      const label =
        item === STRINGS.filters.allCategories
          ? item
          : formatCategoryLabel(item);

      const chipStyle: ViewStyle = {
        backgroundColor: isActive ? COLORS.ink : COLORS.surface,
        borderColor: isActive ? COLORS.ink : COLORS.border,
      };

      return (
        <Pressable
          onPress={() => onSelectCategory(item)}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={label}
          style={[styles.chip, chipStyle]}
        >
          <Typography
            variant="sm"
            color={isActive ? COLORS.surface : COLORS.ink}
          >
            {label}
          </Typography>
        </Pressable>
      );
    },
    [selectedCategory, onSelectCategory]
  );

  const keyExtractor = useCallback((item: string): string => item, []);

  return (
    <FlatList
      horizontal
      data={categories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xs,
  },
  chip: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
});
