const CATEGORY_TRANSLATIONS: Readonly<Record<string, string>> = Object.freeze({
  beauty: 'Belleza',
  fragrances: 'Fragancias',
  furniture: 'Muebles',
  groceries: 'Supermercado',
  'home-decoration': 'Decoración',
  'kitchen-accessories': 'Cocina',
  laptops: 'Portátiles',
  'mens-shirts': 'Camisas hombre',
  'mens-shoes': 'Zapatos hombre',
  'mens-watches': 'Relojes hombre',
  'mobile-accessories': 'Accesorios móvil',
  motorcycle: 'Motos',
  'skin-care': 'Cuidado facial',
  smartphones: 'Celulares',
  'sports-accessories': 'Deportes',
  sunglasses: 'Gafas de sol',
  tablets: 'Tablets',
  tops: 'Prendas superiores',
  vehicle: 'Vehículos',
  'womens-bags': 'Bolsos mujer',
  'womens-dresses': 'Vestidos mujer',
  'womens-jewellery': 'Joyería',
  'womens-shoes': 'Zapatos mujer',
  'womens-watches': 'Relojes mujer',
});

export const formatCategoryLabel = (category: string): string => {
  const trimmed = category.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const normalizedKey = trimmed.toLowerCase().replace(/[\s_]+/g, '-');
  const translated = CATEGORY_TRANSLATIONS[normalizedKey];
  if (translated !== undefined) {
    return translated;
  }

  const clean = trimmed.replace(/[-_]+/g, ' ').toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};
