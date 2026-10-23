import { useCallback, useEffect, useRef, useState } from 'react';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { GetProductsUseCase } from '@/features/products/application/use-case/GetProductsUseCase';
import { container } from '@/di/container';

export interface UseProductListState {
  readonly data: readonly Product[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => Promise<void>;
}

export const useProductList = (
  useCase: GetProductsUseCase = container.getProductsUseCase
): UseProductListState => {
  const [data, setData] = useState<readonly Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const fetchProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const products = await useCase.execute();
      if (isMountedRef.current) {
        setData(products);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const message =
          typeof err === 'object' &&
          err !== null &&
          'message' in err &&
          typeof err.message === 'string'
            ? err.message
            : STRINGS.products.loadError;
        setError(message);
        setIsLoading(false);
      }
    }
  }, [useCase]);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchProducts();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProducts]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProducts,
  };
};
