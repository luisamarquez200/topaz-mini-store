import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SPACING } from '@/core/theme/spacing';

export interface CenteredStateProps {
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

export const CenteredState: React.FC<CenteredStateProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
});
