import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { Skeleton } from '@/shared/components/Skeleton';

const THUMBNAIL_SIZE = 84;

export const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <Skeleton
        width={THUMBNAIL_SIZE}
        height={THUMBNAIL_SIZE}
        borderRadius={RADIUS.md}
      />
      <View style={styles.info}>
        <Skeleton width={70} height={12} borderRadius={RADIUS.xs} />
        <Skeleton
          width="90%"
          height={16}
          borderRadius={RADIUS.xs}
          style={styles.lineSpacing}
        />
        <Skeleton
          width="60%"
          height={16}
          borderRadius={RADIUS.xs}
          style={styles.lineSpacing}
        />
        <View style={styles.footer}>
          <Skeleton width={80} height={20} borderRadius={RADIUS.xs} />
          <Skeleton width={44} height={20} borderRadius={RADIUS.xs} />
        </View>
      </View>
    </View>
  );
};

export const ProductListSkeleton: React.FC<{ readonly count?: number }> = ({
  count = 6,
}) => {
  const items = Array.from({ length: count }, (_, index) => index);
  return (
    <View style={styles.list}>
      {items.map((key) => (
        <ProductCardSkeleton key={`skeleton-item-${key}`} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.card,
    marginHorizontal: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  lineSpacing: {
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
});
