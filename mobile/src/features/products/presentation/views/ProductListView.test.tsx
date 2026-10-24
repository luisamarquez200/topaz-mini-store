import React from 'react';
import { Text } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { ProductListView } from '@/features/products/presentation/views/ProductListView';
import { UseProductListState } from '@/features/products/presentation/hooks/useProductList';
import { buildProduct } from '@/test-utils/productFixtures';

const mockNavigate = jest.fn();
const mockUseProductList = jest.fn<UseProductListState, []>();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('@/features/products/presentation/hooks/useProductList', () => ({
  useProductList: () => mockUseProductList(),
}));

const CHEAP = buildProduct({ id: 1, title: 'Cheap Item', price: 5 });
const PRICEY = buildProduct({ id: 2, title: 'Pricey Item', price: 500 });
const MID = buildProduct({ id: 3, title: 'Mid Item', price: 50 });

const listState = (
  overrides: Partial<UseProductListState> = {}
): UseProductListState => ({
  data: [MID, PRICEY, CHEAP],
  isLoading: false,
  error: null,
  refetch: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

const renderedTitles = (
  getAllByText: (
    pattern: RegExp
  ) => readonly { props: Record<string, unknown> }[]
): unknown[] => getAllByText(/Item$/).map((node) => node.props.children);

describe('ProductListView', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseProductList.mockReset();
  });

  it('should render every product with the injected item action', async () => {
    // Arrange
    mockUseProductList.mockReturnValue(listState());

    // Act
    const { getByText, getAllByText } = await render(
      <ProductListView
        renderItemAction={(p) => <Text>{`action-${p.id}`}</Text>}
      />
    );

    // Assert
    expect(getByText(CHEAP.title)).toBeTruthy();
    expect(getAllByText(/^action-/)).toHaveLength(3);
  });

  it('should reorder products when a sort option is selected', async () => {
    // Arrange
    mockUseProductList.mockReturnValue(listState());
    const { getByLabelText, getAllByText } = await render(<ProductListView />);
    expect(renderedTitles(getAllByText)).toEqual([
      MID.title,
      PRICEY.title,
      CHEAP.title,
    ]);

    // Act
    await fireEvent.press(getByLabelText(STRINGS.sort.priceAsc));

    // Assert
    expect(renderedTitles(getAllByText)).toEqual([
      CHEAP.title,
      MID.title,
      PRICEY.title,
    ]);
    expect(
      getByLabelText(STRINGS.sort.priceAsc).props.accessibilityState
    ).toMatchObject({ checked: true });

    // Act
    await fireEvent.press(getByLabelText(STRINGS.sort.priceDesc));

    // Assert
    expect(renderedTitles(getAllByText)).toEqual([
      PRICEY.title,
      MID.title,
      CHEAP.title,
    ]);
  });

  it('should navigate to detail when a product is pressed', async () => {
    // Arrange
    mockUseProductList.mockReturnValue(listState());
    const { getByLabelText } = await render(<ProductListView />);

    // Act
    await fireEvent.press(getByLabelText(PRICEY.title));

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', {
      productId: PRICEY.id,
    });
  });

  it('should show error view and retry when loading fails', async () => {
    // Arrange
    const refetch = jest.fn().mockResolvedValue(undefined);
    mockUseProductList.mockReturnValue(
      listState({ data: [], error: STRINGS.common.networkError, refetch })
    );
    const { getByText } = await render(<ProductListView />);

    // Act
    await fireEvent.press(getByText(STRINGS.common.retry));

    // Assert
    expect(getByText(STRINGS.common.networkError)).toBeTruthy();
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
