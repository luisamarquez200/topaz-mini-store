import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Button } from '@/shared/components/Button';
import { Typography } from '@/shared/components/Typography';

const EMPTY_ICON_SIZE = 48;

export interface SearchEmptyStateProps {
  readonly onClearFilters: () => void;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  onClearFilters,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={EMPTY_ICON_SIZE}
        color={COLORS.muted}
        style={styles.icon}
      />
      <Typography
        variant="title"
        color={COLORS.ink}
        align="center"
        style={styles.title}
      >
        {STRINGS.filters.noResultsTitle}
      </Typography>
      <Typography
        variant="body"
        color={COLORS.muted}
        align="center"
        style={styles.subtitle}
      >
        {STRINGS.filters.noResultsSubtitle}
      </Typography>
      <Button
        title={STRINGS.filters.clearFiltersButton}
        onPress={onClearFilters}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
  },
  icon: {
    marginBottom: SPACING.md,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  subtitle: {
    maxWidth: 280,
    marginBottom: SPACING.xl,
  },
  button: {
    minWidth: 160,
  },
});
