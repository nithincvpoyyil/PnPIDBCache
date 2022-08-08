import { ICustomStoreParams } from './IDBStorage';
/**
 * Stale-while-revalidate caching strategy without expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param dbParams - custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate
 *
 * @example
 * const reponse = await staleWhileRevalidate("key-1", sp.web.select("Title", "Description").get(),{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
export declare function staleWhileRevalidate<T>(key: string, p: Promise<T>, dbParams?: ICustomStoreParams): Promise<T>;
/**
 * Stale-while-revalidate caching strategy with expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param expiry - Date object for the cache expiration. If this value is  not passed, default value will be taken current time + 1 hour
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate
 *
 * @example
 * let expiry = new Date(new Date().getTme()+980000);
 * let request = sp.web.select("Title", "Description").get()
 * const reponse = await staleWhileRevalidateWithExpiry("key-1", request, expiry,{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
export declare function staleWhileRevalidateWithExpiry<T>(key: string, p: Promise<T>, expiry?: Date, dbParams?: ICustomStoreParams): Promise<T>;
/**
 *
 * cache-first caching strategy with expiration
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param expiry - Date object for the cache expiration. If this value is  not passed, default value will be taken current time + 1 hour
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network
 *
 * @example
 * let expiry = new Date(new Date().getTme()+980000);
 * let request = sp.web.select("Title", "Description").get()
 * const reponse = await cacheFirst("key-1", request, expiry,{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
export declare function cacheFirst<T>(key: string, p: Promise<T>, expiry?: Date, dbParams?: ICustomStoreParams): Promise<T>;
/**
 *
 * cache-only caching strategy with expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T | undefined>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only
 *
 * @example
 *
 * const reponse = await cacheOnly("key-1", {dbName:'myAppcacheDB',storeName:'homePage'});
 */
export declare function cacheOnly<T>(key: string, dbParams?: ICustomStoreParams): Promise<T | undefined>;
