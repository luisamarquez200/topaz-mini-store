import React, { useCallback } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { FONT_FAMILY } from '@/core/theme/typography';

const SEARCH_ICON_SIZE = 18;
const CLEAR_ICON_SIZE = 18;
const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export interface SearchBarProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  style,
}) => {
  const handleClear = useCallback((): void => {
    onChangeText('');
  }, [onChangeText]);

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name="search-outline"
        size={SEARCH_ICON_SIZE}
        color={COLORS.muted}
        style={styles.searchIcon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={STRINGS.filters.searchPlaceholder}
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        accessibilityLabel={STRINGS.filters.searchA11y}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.filters.clearSearchA11y}
          style={styles.clearButton}
        >
          <Ionicons
            name="close-circle"
            size={CLEAR_ICON_SIZE}
            color={COLORS.muted}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.ink,
    fontFamily: FONT_FAMILY.regular,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
