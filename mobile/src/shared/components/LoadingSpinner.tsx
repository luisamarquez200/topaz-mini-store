import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { Typography } from '@/shared/components/Typography';

export interface LoadingSpinnerProps {
  readonly message?: string;
  readonly color?: string;
  readonly size?: 'small' | 'large';
  readonly style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  color = COLORS.accent,
  size = 'large',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message !== undefined && message.length > 0 && (
        <Typography
          variant="body"
          color={COLORS.textSecondary}
          style={styles.message}
          align="center"
        >
          {message}
        </Typography>
      )}
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
  message: {
    marginTop: SPACING.md,
  },
});
