import { useCallback, useEffect, useRef, useState } from 'react';
import { STRINGS } from '@/core/theme/strings';
import { Product } from '@/features/products/domain/types/Product';
import { GetProductByIdUseCase } from '@/features/products/application/use-case/GetProductByIdUseCase';
import { container } from '@/di/container';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

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
  const activeIdRef = useRef<number>(productId);

  const fetchProduct = useCallback(async (): Promise<void> => {
    activeIdRef.current = productId;
    setIsLoading(true);
    setError(null);

    try {
      const product = await useCase.execute(productId);
      if (isMountedRef.current && activeIdRef.current === productId) {
        if (product === null) {
          setError(STRINGS.products.notFound);
        } else {
          setData(product);
        }
      }
    } catch (err: unknown) {
      if (isMountedRef.current && activeIdRef.current === productId) {
        setError(getErrorMessage(err, STRINGS.products.detailLoadError));
      }
    } finally {
      if (isMountedRef.current && activeIdRef.current === productId) {
        setIsLoading(false);
      }
    }
  }, [productId, useCase]);

  useEffect(() => {
    isMountedRef.current = true;
    activeIdRef.current = productId;
    void fetchProduct();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchProduct, productId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchProduct,
  };
};
