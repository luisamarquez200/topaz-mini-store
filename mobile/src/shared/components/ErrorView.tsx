import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Button } from '@/shared/components/Button';
import { Typography } from '@/shared/components/Typography';

export interface ErrorViewProps {
  readonly title?: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly retryTitle?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = STRINGS.common.defaultErrorTitle,
  message,
  onRetry,
  retryTitle = STRINGS.common.retry,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Typography variant="heading" color={COLORS.danger}>
            !
          </Typography>
        </View>
        <Typography
          variant="title"
          color={COLORS.text}
          align="center"
          style={styles.title}
        >
          {title}
        </Typography>
        <Typography
          variant="body"
          color={COLORS.textSecondary}
          align="center"
          style={styles.message}
        >
          {message}
        </Typography>
        {onRetry !== undefined && (
          <Button
            title={retryTitle}
            onPress={onRetry}
            variant="primary"
            style={styles.button}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xxl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.imageBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  message: {
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
  },
});
