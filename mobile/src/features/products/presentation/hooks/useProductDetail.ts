import { useCallback, useEffect, useRef, useState } from 'react';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { GetProductByIdUseCase } from '@/features/products/application/use-case/GetProductByIdUseCase';
import { container } from '@/di/container';

export interface UseProductDetailState {
  readonly data: Product | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refetch: () => Promise<void>;
}

export const useProductDetail = (
  productId: number,
  useCase: GetProductByIdUseCase = container.getProductByIdUseCase
): UseProductDetailState => {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const fetchProduct = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const product = await useCase.execute(productId);
      if (isMountedRef.current) {
        if (product === null) {
          setError(STRINGS.products.notFound);
        } else {
          setData(product);
        }
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
            : STRINGS.products.detailLoadError;
        setError(message);
        setIsLoading(false);
      }
    }
  }, [productId, useCase]);

  useEffect(() => {
    isMountedRef.current = true;
    void fetchProduct();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProduct]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProduct,
  };
};
