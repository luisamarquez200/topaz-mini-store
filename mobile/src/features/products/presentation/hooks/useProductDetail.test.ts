import { act, renderHook, waitFor } from '@testing-library/react-native';
import { STRINGS } from '@/core/theme/strings';
import { IProductRepository } from '@/features/products/domain/repository/IProductRepository';
import { GetProductByIdUseCase } from '@/features/products/application/use-case/GetProductByIdUseCase';
import { useProductDetail } from '@/features/products/presentation/hooks/useProductDetail';
import { buildProduct } from '@/test-utils/productFixtures';

const buildUseCase = (
  getProductById: IProductRepository['getProductById']
): GetProductByIdUseCase =>
  new GetProductByIdUseCase({
    getProducts: jest.fn().mockResolvedValue([]),
    getProductById,
  });

describe('useProductDetail', () => {
  it('should start loading and then expose the fetched product', async () => {
    // Arrange
    const product = buildProduct({ id: 5 });
    const useCase = buildUseCase(jest.fn().mockResolvedValue(product));

    // Act
    const { result } = await renderHook(() => useProductDetail(5, useCase));

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(product);
    expect(result.current.error).toBeNull();
  });

  it('should expose a not found error when the product does not exist', async () => {
    // Arrange
    const useCase = buildUseCase(jest.fn().mockResolvedValue(null));

    // Act
    const { result } = await renderHook(() => useProductDetail(99, useCase));

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(STRINGS.products.notFound);
  });

  it('should recover after a failed request when refetch succeeds', async () => {
    // Arrange
    const product = buildProduct({ id: 7 });
    const getProductById = jest
      .fn()
      .mockRejectedValueOnce(new Error(STRINGS.common.networkError))
      .mockResolvedValueOnce(product);
    const useCase = buildUseCase(getProductById);
    const { result } = await renderHook(() => useProductDetail(7, useCase));
    await waitFor(() =>
      expect(result.current.error).toBe(STRINGS.common.networkError)
    );

    // Act
    await act(async () => {
      await result.current.refetch();
    });

    // Assert
    expect(getProductById).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(product);
  });

  it('should not show the previous product while a new id is loading', async () => {
    // Arrange
    const first = buildProduct({ id: 1 });
    const second = buildProduct({ id: 2 });
    let resolveSecond: (product: typeof second) => void = () => undefined;
    const getProductById = jest
      .fn()
      .mockResolvedValueOnce(first)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          })
      );
    const useCase = buildUseCase(getProductById);
    const { result, rerender } = await renderHook(
      ({ id }: { id: number }) => useProductDetail(id, useCase),
      { initialProps: { id: 1 } }
    );
    await waitFor(() => expect(result.current.data).toEqual(first));

    // Act
    await rerender({ id: 2 });

    // Assert
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();

    // Act
    await act(async () => {
      resolveSecond(second);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(second);
  });
});
