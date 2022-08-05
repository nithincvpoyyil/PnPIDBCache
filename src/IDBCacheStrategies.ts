import { ICustomStoreParams, IDBStorage } from './IDBStorage';

let indexedDBStorageInstance: IDBStorage;

interface IResponseDataWithExpiry<T = any> {
  expiry: Date;
  indexedDBCache: number;
  data: T;
}

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

export async function staleWhileRevalidate<T>(key: string, p: Promise<T>, dbParams?: ICustomStoreParams): Promise<T> {
  if (!dbParams) {
    dbParams = { dbName: '', storeName: '' };
  }

  if (!indexedDBStorageInstance) {
    indexedDBStorageInstance = new IDBStorage(dbParams);
  }

  if (!indexedDBStorageInstance.indexedDBError) {
    const value = <T | undefined>await indexedDBStorageInstance.getItem(key);

    if (value) {
      // update cache once we have a result
      p.then((u) => {
        return indexedDBStorageInstance.setItem(key, u);
      });

      // response return from cache
      return value;
    }
  }

  // Not in cache so we need to wait for the value
  const result = await p;

  // Set Cache
  if (!indexedDBStorageInstance.indexedDBError) {
    indexedDBStorageInstance.setItem(key, result);
  }

  // Return from Promise
  return result;
}

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
export async function staleWhileRevalidateWithExpiry<T>(
  key: string,
  p: Promise<T>,
  expiry?: Date,
  dbParams?: ICustomStoreParams,
): Promise<T> {
  if (!indexedDBStorageInstance) {
    indexedDBStorageInstance = new IDBStorage(dbParams);
  }

  if (!dbParams) {
    dbParams = { dbName: '', storeName: '' };
  }
  let expiryDate = expiry && typeof Date === 'object' ? expiry : new Date(new Date().getTime() + 1000 * 60 * 10); // 10 minutes

  if (!indexedDBStorageInstance.indexedDBError) {
    const value = <IResponseDataWithExpiry<T>>await indexedDBStorageInstance.getItem(key);
    let isExpired = value.expiry <= new Date();

    if (value && value.indexedDBCache && !isExpired) {
      // update cache once we have a result
      p.then((u) => {
        let response: IResponseDataWithExpiry = { expiry: expiryDate, data: u, indexedDBCache: 1 };
        return indexedDBStorageInstance.setItem(key, response);
      });

      // response return from cache
      return value.data;
    }
  }

  // not in cache or expired, so we need to wait for the value
  const result = await p;

  // Set Cache
  if (!indexedDBStorageInstance.indexedDBError) {
    let data: IResponseDataWithExpiry = { expiry: expiryDate, data: result, indexedDBCache: 1 };
    indexedDBStorageInstance.setItem(key, data);
  }

  // return from promise
  return result;
}

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
export async function cacheFirst<T>(
  key: string,
  p: Promise<T>,
  expiry?: Date,
  dbParams?: ICustomStoreParams,
): Promise<T> {
  if (!dbParams) {
    dbParams = { dbName: '', storeName: '' };
  }

  if (!indexedDBStorageInstance) {
    indexedDBStorageInstance = new IDBStorage(dbParams);
  }

  let expiryDate = expiry && typeof Date === 'object' ? expiry : new Date(new Date().getTime() + 1000 * 60 * 10); // 10 minutes

  if (!indexedDBStorageInstance.indexedDBError) {
    const value = <IResponseDataWithExpiry<T>>await indexedDBStorageInstance.getItem(key);
    let isExpired = value.expiry <= new Date();

    // Return from Cache
    if (value && value.indexedDBCache && !isExpired) {
      return value.data;
    }
  }

  // Not In Cache so we need to wait for the value
  const result = await p;

  // Set Cache
  if (!indexedDBStorageInstance.indexedDBError) {
    let data: IResponseDataWithExpiry = { expiry: expiryDate, data: result, indexedDBCache: 1 };
    indexedDBStorageInstance.setItem(key, data);
  }

  // Return from Promise
  return result;
}

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
export async function cacheOnly<T>(key: string, dbParams?: ICustomStoreParams): Promise<T | undefined> {
  if (!dbParams) {
    dbParams = { dbName: '', storeName: '' };
  }

  if (!indexedDBStorageInstance) {
    indexedDBStorageInstance = new IDBStorage(dbParams);
  }

  if (!indexedDBStorageInstance.indexedDBError) {
    const value = <IResponseDataWithExpiry<T>>await indexedDBStorageInstance.getItem(key);
    let isExpired = value.expiry <= new Date();

    // Return from Cache
    if (value && value.indexedDBCache && !isExpired) {
      return value.data;
    } else {
      return undefined;
    }
  }
}
