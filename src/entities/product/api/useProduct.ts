import { useQuery, type QueryResult } from '@/shared/lib/use-query';
import { getProduct } from './getProduct';
import type { Product } from '../model/types';

export function useProduct(productId: string): QueryResult<Product> {
  return useQuery(() => getProduct(productId), [productId]);
}
