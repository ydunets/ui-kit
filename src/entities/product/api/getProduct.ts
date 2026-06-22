import { apiGet } from '@/shared/api';
import type { Product } from '../model/types';

export function getProduct(productId: string): Promise<Product> {
  return apiGet<Product>(`/v1/products/${productId}`);
}
