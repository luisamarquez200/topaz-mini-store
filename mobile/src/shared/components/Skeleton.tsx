import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '@/core/theme/colors';
import { RADIUS } from '@/core/theme/spacing';

export interface SkeletonProps {
  readonly width?: number | `${number}%`;
  readonly height?: number;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.sm,
  style,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 750 }),
        withTiming(0.4, { duration: 750 })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const baseStyle: ViewStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: COLORS.skeleton,
  };

  return <Animated.View style={[baseStyle, animatedStyle, style]} />;
};
