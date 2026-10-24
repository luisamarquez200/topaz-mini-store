import { formatCategoryLabel } from '@/features/products/application/formatCategoryLabel';

describe('formatCategoryLabel', () => {
  it('should translate known hyphenated categories into Spanish', () => {
    // Arrange
    const input = 'skin-care';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Cuidado facial');
  });

  it('should translate single word categories into Spanish', () => {
    // Arrange
    const input = 'beauty';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Belleza');
  });

  it('should handle underscored categories with translation', () => {
    // Arrange
    const input = 'home_decoration';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Decoración');
  });

  it('should fallback to capitalized formatting for unknown categories', () => {
    // Arrange
    const input = 'custom-gear';

    // Act
    const result = formatCategoryLabel(input);

    // Assert
    expect(result).toBe('Custom gear');
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
