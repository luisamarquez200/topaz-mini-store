import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../core/theme/colors';
import { RADIUS, SPACING } from '../../core/theme/spacing';
import { Typography } from './Typography';

export interface FavoriteBadgeProps {
  readonly isFavorite: boolean;
  readonly onPress?: () => void;
  readonly size?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export const FavoriteBadge: React.FC<FavoriteBadgeProps> = ({
  isFavorite,
  onPress,
  size = 36,
  style,
}) => {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: RADIUS.round,
    backgroundColor: isFavorite ? COLORS.favoriteLight : COLORS.surface,
    borderColor: isFavorite ? COLORS.favorite : COLORS.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const content = (
    <View style={[containerStyle, style]}>
      <Typography
        variant="smBold"
        color={isFavorite ? COLORS.favorite : COLORS.textMuted}
      >
        {isFavorite ? '♥' : '♡'}
      </Typography>
    </View>
  );

  if (onPress !== undefined) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={{ top: SPACING.sm, bottom: SPACING.sm, left: SPACING.sm, right: SPACING.sm }}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};
