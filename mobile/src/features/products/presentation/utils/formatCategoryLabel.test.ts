import { formatCategoryLabel } from '@/features/products/presentation/utils/formatCategoryLabel';

describe('formatCategoryLabel', () => {
  it('should format hyphenated categories into capitalized words', () => {
    // Arrange
    const input = 'skin-care';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Skin care');
  });

  it('should format single word categories properly', () => {
    // Arrange
    const input = 'beauty';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Beauty');
  });

  it('should handle underscored categories', () => {
    // Arrange
    const input = 'home_decoration';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Home decoration');
  });

  it('should handle empty string safely', () => {
    // Arrange
    const input = '   ';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('');
  });
});
