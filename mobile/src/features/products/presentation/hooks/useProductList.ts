import { useCallback, useEffect, useRef, useState } from 'react';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { GetProductsUseCase } from '@/features/products/application/use-case/GetProductsUseCase';
import { container } from '@/di/container';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

export interface UseProductListState {
  readonly data: readonly Product[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => Promise<void>;
}

type FetchOutcome =
  | { readonly products: readonly Product[]; readonly error: null }
  | { readonly products: null; readonly error: string };

export const useProductList = (
  useCase: GetProductsUseCase = container.getProductsUseCase
): UseProductListState => {
  const [data, setData] = useState<readonly Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const fetchProducts = useCallback(async (): Promise<FetchOutcome> => {
    try {
      return { products: await useCase.execute(), error: null };
    } catch (err: unknown) {
      return {
        products: null,
        error: getErrorMessage(err, STRINGS.products.loadError),
      };
    }
  }, [useCase]);

  const applyOutcome = useCallback((outcome: FetchOutcome): void => {
    if (outcome.products !== null) {
      setData(outcome.products);
    }
    setError(outcome.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let isActive = true;
    void fetchProducts().then((outcome) => {
      if (isActive) {
        applyOutcome(outcome);
      }
    });

    return () => {
      isActive = false;
      isMountedRef.current = false;
    };
  }, [fetchProducts, applyOutcome]);

  const refetch = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const outcome = await fetchProducts();
    if (isMountedRef.current) {
      applyOutcome(outcome);
    }
  }, [fetchProducts, applyOutcome]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
