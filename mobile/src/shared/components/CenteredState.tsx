import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CenteredContainer } from '@/shared/components/CenteredContainer';

export interface CenteredStateProps {
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

export const CenteredState: React.FC<CenteredStateProps> = ({
  children,
  style,
}) => {
  return <CenteredContainer style={style}>{children}</CenteredContainer>;
};
