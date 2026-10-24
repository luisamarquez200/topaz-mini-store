import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export const triggerHaptic = (
  style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium
): void => {
  void impactAsync(style).catch(() => undefined);
};
