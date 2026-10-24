import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

export const triggerHaptic = (style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium): void => {
  try {
    void impactAsync(style);
  } catch {
    // Non-native / Jest fallback: safely ignore unsupported environments
  }
};
