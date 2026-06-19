import { useCallback, useSyncExternalStore } from 'react';

/**
 * Returns whether a CSS media query currently matches, staying in sync as the
 * viewport changes.
 *
 * Uses `useSyncExternalStore` rather than `useEffect` + `useState`: the browser's
 * `MediaQueryList` is an external store, so this is the idiomatic (and SSR-safe)
 * way to subscribe to it without an effect.
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  // On the server there's no `matchMedia`; default to "not matching".
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
