export enum ProductCategory {
  BEAUTY = 'beauty',
  FRAGRANCES = 'fragrances',
  FURNITURE = 'furniture',
  GROCERIES = 'groceries',
  HOME_DECORATION = 'home-decoration',
  KITCHEN_ACCESSORIES = 'kitchen-accessories',
  LAPTOPS = 'laptops',
  MENS_SHIRTS = 'mens-shirts',
  MENS_SHOES = 'mens-shoes',
  MENS_WATCHES = 'mens-watches',
  MOBILE_ACCESSORIES = 'mobile-accessories',
  MOTORCYCLE = 'motorcycle',
  SKIN_CARE = 'skin-care',
  SMARTPHONES = 'smartphones',
  SPORTS_ACCESSORIES = 'sports-accessories',
  SUNGLASSES = 'sunglasses',
  TABLETS = 'tablets',
  TOPS = 'tops',
  VEHICLE = 'vehicle',
  WOMENS_BAGS = 'womens-bags',
  WOMENS_DRESSES = 'womens-dresses',
  WOMENS_JEWELLERY = 'womens-jewellery',
  WOMENS_SHOES = 'womens-shoes',
  WOMENS_WATCHES = 'womens-watches',
  OTHER = 'other',
}

const CATEGORY_MAP: Record<string, ProductCategory> = Object.freeze({
  [ProductCategory.BEAUTY]: ProductCategory.BEAUTY,
  [ProductCategory.FRAGRANCES]: ProductCategory.FRAGRANCES,
  [ProductCategory.FURNITURE]: ProductCategory.FURNITURE,
  [ProductCategory.GROCERIES]: ProductCategory.GROCERIES,
  [ProductCategory.HOME_DECORATION]: ProductCategory.HOME_DECORATION,
  [ProductCategory.KITCHEN_ACCESSORIES]: ProductCategory.KITCHEN_ACCESSORIES,
  [ProductCategory.LAPTOPS]: ProductCategory.LAPTOPS,
  [ProductCategory.MENS_SHIRTS]: ProductCategory.MENS_SHIRTS,
  [ProductCategory.MENS_SHOES]: ProductCategory.MENS_SHOES,
  [ProductCategory.MENS_WATCHES]: ProductCategory.MENS_WATCHES,
  [ProductCategory.MOBILE_ACCESSORIES]: ProductCategory.MOBILE_ACCESSORIES,
  [ProductCategory.MOTORCYCLE]: ProductCategory.MOTORCYCLE,
  [ProductCategory.SKIN_CARE]: ProductCategory.SKIN_CARE,
  [ProductCategory.SMARTPHONES]: ProductCategory.SMARTPHONES,
  [ProductCategory.SPORTS_ACCESSORIES]: ProductCategory.SPORTS_ACCESSORIES,
  [ProductCategory.SUNGLASSES]: ProductCategory.SUNGLASSES,
  [ProductCategory.TABLETS]: ProductCategory.TABLETS,
  [ProductCategory.TOPS]: ProductCategory.TOPS,
  [ProductCategory.VEHICLE]: ProductCategory.VEHICLE,
  [ProductCategory.WOMENS_BAGS]: ProductCategory.WOMENS_BAGS,
  [ProductCategory.WOMENS_DRESSES]: ProductCategory.WOMENS_DRESSES,
  [ProductCategory.WOMENS_JEWELLERY]: ProductCategory.WOMENS_JEWELLERY,
  [ProductCategory.WOMENS_SHOES]: ProductCategory.WOMENS_SHOES,
  [ProductCategory.WOMENS_WATCHES]: ProductCategory.WOMENS_WATCHES,
  [ProductCategory.OTHER]: ProductCategory.OTHER,
});

export const parseProductCategory = (
  value: string | null | undefined
): ProductCategory => {
  if (typeof value !== 'string') {
    return ProductCategory.OTHER;
  }
  const match = CATEGORY_MAP[value.trim().toLowerCase()];
  return match !== undefined ? match : ProductCategory.OTHER;
};
