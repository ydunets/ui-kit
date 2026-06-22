import { useProduct } from '@/entities/product';
import { ProductDetails } from './ProductDetails';
import type { DemoState } from '../lib/product-display';
import styles from './ProductDetailsSection.module.css';

export type TProductDetailsSectionProps = {
  productId: string;
  demoState?: DemoState;
};

export const ProductDetailsSection = ({
  productId,
  demoState = 'default',
}: TProductDetailsSectionProps) => {
  const state = useProduct(productId);

  if (state.status === 'loading') {
    return <div className={styles.status}>Loading product…</div>;
  }

  if (state.status === 'error') {
    const message = state.error instanceof Error ? state.error.message : 'Unknown error';
    return <div className={styles.error}>Could not load the product: {message}</div>;
  }

  // Re-key on demoState so switching showcase states re-initialises selection.
  return <ProductDetails key={demoState} product={state.data} demoState={demoState} />;
};
