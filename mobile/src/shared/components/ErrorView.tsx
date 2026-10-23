import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '../../core/theme/colors';
import { RADIUS, SPACING } from '../../core/theme/spacing';
import { Button } from './Button';
import { Typography } from './Typography';

export interface ErrorViewProps {
  readonly title?: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly retryTitle?: string;
  readonly style?: StyleProp<ViewStyle>;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Ha ocurrido un problema',
  message,
  onRetry,
  retryTitle = 'Reintentar',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Typography variant="heading" color={COLORS.error}>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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
    backgroundColor: COLORS.errorLight,
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
