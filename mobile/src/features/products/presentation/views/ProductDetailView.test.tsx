import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { ProductDetailView } from '@/features/products/presentation/views/ProductDetailView';
import { UseProductDetailState } from '@/features/products/presentation/hooks/useProductDetail';
import { buildProduct } from '@/test-utils/productFixtures';

const PRODUCT_ID = 42;
const mockUseProductDetail = jest.fn<UseProductDetailState, [number]>();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { productId: 42 } }),
}));

jest.mock('@/features/products/presentation/hooks/useProductDetail', () => ({
  useProductDetail: (id: number) => mockUseProductDetail(id),
}));

const detailState = (
  overrides: Partial<UseProductDetailState> = {}
): UseProductDetailState => ({
  data: null,
  isLoading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('ProductDetailView', () => {
  beforeEach(() => {
    mockUseProductDetail.mockReset();
  });

  it('should render product details, discounted prices and injected actions', async () => {
    // Arrange
    const product = buildProduct({
      id: PRODUCT_ID,
      title: 'Wireless Headphones',
      brand: 'Topaz',
      price: 80,
      discountPercentage: 20,
      stock: 3,
    });
    mockUseProductDetail.mockReturnValue(detailState({ data: product }));

    // Act
    const { getByText } = await render(
      <ProductDetailView
        renderFavoriteButton={() => <Text>top-action</Text>}
        renderBottomAction={() => <Text>bottom-action</Text>}
      />
    );

    // Assert
    expect(mockUseProductDetail).toHaveBeenCalledWith(PRODUCT_ID);
    expect(getByText('Wireless Headphones')).toBeTruthy();
    expect(getByText(`${STRINGS.products.brandPrefix}Topaz`)).toBeTruthy();
    expect(getByText(`${STRINGS.products.stockPrefix}3`)).toBeTruthy();
    expect(getByText('$80.00')).toBeTruthy();
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('-20%')).toBeTruthy();
    expect(getByText('top-action')).toBeTruthy();
    expect(getByText('bottom-action')).toBeTruthy();
  });

  it('should show out of stock label when stock is zero', async () => {
    // Arrange
    mockUseProductDetail.mockReturnValue(
      detailState({ data: buildProduct({ id: PRODUCT_ID, stock: 0 }) })
    );

    // Act
    const { getByText } = await render(<ProductDetailView />);

    // Assert
    expect(getByText(STRINGS.products.outOfStock)).toBeTruthy();
  });

  it('should show loading state while fetching', async () => {
    // Arrange
    mockUseProductDetail.mockReturnValue(detailState({ isLoading: true }));

    // Act
    const { getByText } = await render(<ProductDetailView />);

    // Assert
    expect(getByText(STRINGS.products.detailLoading)).toBeTruthy();
  });

  it('should show error and retry when the request fails', async () => {
    // Arrange
    const refetch = jest.fn().mockResolvedValue(undefined);
    mockUseProductDetail.mockReturnValue(
      detailState({ error: STRINGS.common.timeoutError, refetch })
    );
    const { getByText } = await render(<ProductDetailView />);

    // Act
    await fireEvent.press(getByText(STRINGS.common.retry));

    // Assert
    expect(getByText(STRINGS.products.detailErrorTitle)).toBeTruthy();
    expect(getByText(STRINGS.common.timeoutError)).toBeTruthy();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
