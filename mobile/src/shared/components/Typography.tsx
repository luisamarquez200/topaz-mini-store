import React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { COLORS } from '../../core/theme/colors';
import { TYPOGRAPHY_VARIANTS } from '../../core/theme/typography';

export type TypographyVariant =
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyBold'
  | 'sm'
  | 'smBold'
  | 'caption';

export interface TypographyProps extends TextProps {
  readonly variant?: TypographyVariant;
  readonly color?: string;
  readonly align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  readonly children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = COLORS.text,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const variantStyle = TYPOGRAPHY_VARIANTS[variant] ?? TYPOGRAPHY_VARIANTS.body;

  const combinedStyle: TextStyle = {
    ...variantStyle,
    color,
    textAlign: align,
  };

  return (
    <Text style={[combinedStyle, style]} {...rest}>
      {children}
    </Text>
  );
};
