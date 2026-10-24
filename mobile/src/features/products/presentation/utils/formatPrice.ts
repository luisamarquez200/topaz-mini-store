import { LOCALE_CONFIG } from '@/core/config/locale';

const priceFormatter = new Intl.NumberFormat(LOCALE_CONFIG.LOCALE, {
  style: 'currency',
  currency: LOCALE_CONFIG.CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (price: number): string => {
  return priceFormatter.format(Number.isFinite(price) ? price : 0);
};
