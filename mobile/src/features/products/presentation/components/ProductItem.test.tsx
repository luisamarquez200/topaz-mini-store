import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { ProductCategory } from '@/features/products/domain/types/ProductCategory';
import { ProductItem } from '@/features/products/presentation/components/ProductItem';

describe('ProductItem', () => {
  const SAMPLE_PRODUCT_ID = 99;
  const SAMPLE_TITLE = 'Essence Mascara';
  const SAMPLE_DESCRIPTION = 'Lash Princess';
  const SAMPLE_CATEGORY = ProductCategory.BEAUTY;
  const SAMPLE_PRICE = 9.99;
  const SAMPLE_DISCOUNT = 10.0;
  const SAMPLE_RATING = 4.5;
  const SAMPLE_STOCK = 50;
  const SAMPLE_BRAND = 'Essence';
  const SAMPLE_THUMBNAIL = 'https://example.com/mascara.jpg';
  const SAMPLE_IMAGES: readonly string[] = Object.freeze(['https://example.com/1.jpg']);

  const sampleProduct: Product = {
    id: SAMPLE_PRODUCT_ID,
    title: SAMPLE_TITLE,
    description: SAMPLE_DESCRIPTION,
    category: SAMPLE_CATEGORY,
    price: SAMPLE_PRICE,
    discountPercentage: SAMPLE_DISCOUNT,
    rating: SAMPLE_RATING,
    stock: SAMPLE_STOCK,
    brand: SAMPLE_BRAND,
    thumbnail: SAMPLE_THUMBNAIL,
    images: SAMPLE_IMAGES,
  };

  it('should render thumbnail, title and formatted price correctly', async () => {
    // Arrange
    const onPressMock = jest.fn();

    // Act
    const { getByText, getByLabelText } = await render(
      <ProductItem product={sampleProduct} onPress={onPressMock} />
    );

    // Assert
    expect(getByText(SAMPLE_TITLE)).toBeTruthy();
    expect(getByText('$9.99')).toBeTruthy();
    expect(getByLabelText(SAMPLE_TITLE)).toBeTruthy();
    expect(
      getByLabelText(`${SAMPLE_TITLE}${STRINGS.products.thumbnailSuffix}`)
    ).toBeTruthy();
  });

  it('should trigger onPress callback with productId when pressed', async () => {
    // Arrange
    const onPressMock = jest.fn();
    const { getByRole } = await render(
      <ProductItem product={sampleProduct} onPress={onPressMock} />
    );

    // Act
    const button = getByRole('button');
    fireEvent.press(button);

    // Assert
    expect(onPressMock).toHaveBeenCalledTimes(1);
    expect(onPressMock).toHaveBeenCalledWith(SAMPLE_PRODUCT_ID);
  });
});
