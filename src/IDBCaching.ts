import { IQueryableInternal, Queryable, QueryablePreObserver } from '@pnp/queryable';
import { getHashCode, dateAdd, TimelinePipe } from '@pnp/core';
import { DEFAULT_DB_NAME, DEFAULT_STORE_NAME, IDBStorage, IIDBValue } from './IDBStorage';

let indexedDBStorageInstance: IDBStorage;

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export interface ICachingProps {
  keyFactory?: CacheKeyFactory;
  expireFunc?: CacheExpireFunc;
}

export function IDBCaching(props?: ICachingProps): TimelinePipe<Queryable> {
  const { keyFactory, expireFunc } = {
    keyFactory: (url: string) => getHashCode(url.toLowerCase()).toString(),
    expireFunc: () => dateAdd(new Date(), 'minute', 24 * 60),
    ...props,
  };

  const idbCacheObserver: QueryablePreObserver = async function (
    this: IQueryableInternal,
    url: string,
    init: RequestInit,
    result: any,
  ) {
    let method = init.method || '';
    //@ts-ignore
    let cacheHeader = init.headers && init?.headers['X-PnP-CacheAlways'] ? init?.headers['X-PnP-CacheAlways'] : '';
    let indexdbData = undefined;
    let isExpired = false;

    // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
    if (/get/i.test(method) || cacheHeader) {
      //@ts-ignore
      const key = init?.headers['X-PnP-CacheKey'] ? init.headers['X-PnP-CacheKey'] : keyFactory(url.toString());

      let dbParams = { dbName: DEFAULT_DB_NAME, storeName: DEFAULT_STORE_NAME };

      if (!indexedDBStorageInstance) {
        indexedDBStorageInstance = new IDBStorage(dbParams);
      }

      if (!indexedDBStorageInstance.indexedDBError) {
        indexdbData = <IIDBValue>await indexedDBStorageInstance.getItem(key);
        isExpired = indexdbData.expiry <= new Date();
      }

      if (indexdbData?.indexedDBCache && !isExpired) {
        result = indexdbData.data;
      } else {
        this.on.post(async function (url: URL, result1: any) {
          let expiryDate = expireFunc(url.toString()) || new Date();
          let toIDBStore: IIDBValue = { expiry: expiryDate, data: result1, indexedDBCache: 1 };
          await indexedDBStorageInstance.setItem(key, toIDBStore);
          return [url, result];
        });
      }
    }

    return Promise.resolve([url, init, result]);
  };

  return (instance: Queryable) => {
    instance.on.pre(idbCacheObserver);
    return instance;
  };
}
