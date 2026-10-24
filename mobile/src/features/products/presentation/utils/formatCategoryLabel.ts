export const formatCategoryLabel = (category: string): string => {
  if (category.trim().length === 0) {
    return '';
  }
  const clean = category.replace(/[-_]+/g, ' ').trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};
