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

interface DetailResult {
  readonly productId: number;
  readonly data: Product | null;
  readonly error: string | null;
}

export const useProductDetail = (
  productId: number,
  useCase: GetProductByIdUseCase = container.getProductByIdUseCase
): UseProductDetailState => {
  const [result, setResult] = useState<DetailResult | null>(null);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  const isMountedRef = useRef<boolean>(true);

  const fetchProduct = useCallback(async (): Promise<DetailResult> => {
    try {
      const product = await useCase.execute(productId);
      return product === null
        ? { productId, data: null, error: STRINGS.products.notFound }
        : { productId, data: product, error: null };
    } catch (err: unknown) {
      return {
        productId,
        data: null,
        error: getErrorMessage(err, STRINGS.products.detailLoadError),
      };
    }
  }, [productId, useCase]);

  const applyResult = useCallback((next: DetailResult): void => {
    setResult(next);
    setIsRefetching(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    let isActive = true;
    void fetchProduct().then((next) => {
      if (isActive) {
        applyResult(next);
      }
    });

    return () => {
      isActive = false;
      isMountedRef.current = false;
    };
  }, [fetchProduct, applyResult]);

  const refetch = useCallback(async (): Promise<void> => {
    setIsRefetching(true);
    const next = await fetchProduct();
    if (isMountedRef.current) {
      applyResult(next);
    }
  }, [fetchProduct, applyResult]);

  const current = result?.productId === productId ? result : null;

  return {
    data: current?.data ?? null,
    isLoading: current === null || isRefetching,
    error: current?.error ?? null,
    refetch,
  };
};
