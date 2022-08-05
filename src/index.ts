import { staleWhileRevalidate, cacheFirst, cacheOnly, staleWhileRevalidateWithExpiry } from './IDBCacheStrategies';

export { staleWhileRevalidate, cacheFirst, cacheOnly, staleWhileRevalidateWithExpiry };

export function test() {
  return 1;
}
