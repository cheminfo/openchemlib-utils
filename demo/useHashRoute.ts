import { useCallback, useSyncExternalStore } from 'react';

export type RouteId = 'diastereotopic' | 'autolabel';

const DEFAULT_ROUTE: RouteId = 'diastereotopic';

/**
 * Reads and writes the current tab from `window.location.hash`.
 * Falls back to `'diastereotopic'` for an unknown or empty hash.
 * @returns the current route and a setter that rewrites the hash
 */
export function useHashRoute(): [RouteId, (route: RouteId) => void] {
  const route = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setRoute = useCallback((next: RouteId) => {
    window.location.hash = `#/${next}`;
  }, []);
  return [route, setRoute];
}

/**
 * Resolves a location hash to a route id.
 * @param hash - the raw `window.location.hash`, with or without its leading `#`
 * @returns the matching route, or `'diastereotopic'` when nothing matches
 */
export function parseHash(hash: string): RouteId {
  const name = hash.replace(/^#\/?/, '');
  return name === 'autolabel' ? 'autolabel' : DEFAULT_ROUTE;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('hashchange', onStoreChange);
  return () => {
    window.removeEventListener('hashchange', onStoreChange);
  };
}

function getSnapshot(): RouteId {
  return parseHash(window.location.hash);
}

function getServerSnapshot(): RouteId {
  return DEFAULT_ROUTE;
}
