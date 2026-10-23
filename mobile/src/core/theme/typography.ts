import { TextStyle } from 'react-native';

export const FONT_SIZE = Object.freeze({
  caption: 11,
  sm: 13,
  body: 15,
  subtitle: 17,
  title: 20,
  heading: 24,
  display: 30,
});

export const FONT_WEIGHT = Object.freeze({
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
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
    fontSize: FONT_SIZE.display,
    fontWeight: '800',
    lineHeight: LINE_HEIGHT.display,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: FONT_SIZE.heading,
    fontWeight: '700',
    lineHeight: LINE_HEIGHT.heading,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: '600',
    lineHeight: LINE_HEIGHT.title,
  },
  subtitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: '500',
    lineHeight: LINE_HEIGHT.subtitle,
  },
  body: {
    fontSize: FONT_SIZE.body,
    fontWeight: '400',
    lineHeight: LINE_HEIGHT.body,
  },
  bodyBold: {
    fontSize: FONT_SIZE.body,
    fontWeight: '600',
    lineHeight: LINE_HEIGHT.body,
  },
  sm: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '400',
    lineHeight: LINE_HEIGHT.sm,
  },
  smBold: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    lineHeight: LINE_HEIGHT.sm,
  },
  caption: {
    fontSize: FONT_SIZE.caption,
    fontWeight: '500',
    lineHeight: LINE_HEIGHT.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
