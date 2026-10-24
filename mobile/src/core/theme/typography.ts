import { TextStyle } from 'react-native';

export const FONT_FAMILY = Object.freeze({
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
});

export const FONT_SIZE = Object.freeze({
  caption: 11,
  sm: 13,
  body: 15,
  subtitle: 17,
  title: 20,
  heading: 24,
  display: 30,
});

export const LINE_HEIGHT = Object.freeze({
  caption: 14,
  sm: 18,
  body: 22,
  subtitle: 24,
  title: 28,
  heading: 32,
  display: 38,
});

export const TYPOGRAPHY_VARIANTS: Record<string, TextStyle> = Object.freeze({
  display: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.display,
    lineHeight: LINE_HEIGHT.display,
    letterSpacing: -0.5,
  },
  heading: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.heading,
    lineHeight: LINE_HEIGHT.heading,
    letterSpacing: -0.3,
  },
  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.title,
    lineHeight: LINE_HEIGHT.title,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.subtitle,
    lineHeight: LINE_HEIGHT.subtitle,
  },
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.body,
    lineHeight: LINE_HEIGHT.body,
  },
  bodyBold: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.body,
    lineHeight: LINE_HEIGHT.body,
  },
  price: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.body,
    lineHeight: LINE_HEIGHT.body,
  },
  sm: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  smBold: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  caption: {
    fontFamily: FONT_FAMILY.semibold,
    fontSize: FONT_SIZE.caption,
    lineHeight: LINE_HEIGHT.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
