export const ENDPOINTS = Object.freeze({
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number): string => `/products/${id.toString()}`,
});
