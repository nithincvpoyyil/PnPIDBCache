import { IQueryableInternal, Queryable, QueryablePreObserver } from '@pnp/queryable';
import { getHashCode, dateAdd, TimelinePipe } from '@pnp/core';
import { defaultIDBStoreParams, ICustomStoreParams, IDBStorageWrapper } from './IDBStorage';

const DEFAULT_CACHE_TIME = 60 * 24; // 24 hours

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export interface ICachingProps {
  keyFactory?: CacheKeyFactory;
  expireFunc?: CacheExpireFunc;
  idbParams?: ICustomStoreParams;
}

export function IDBCaching(props?: ICachingProps): TimelinePipe<Queryable> {
  const { keyFactory, expireFunc } = {
    keyFactory: (url: string) => getHashCode(url.toLowerCase()).toString(),
    expireFunc: () => dateAdd(new Date(), 'minute', DEFAULT_CACHE_TIME),
    ...props,
  };

  let idbParams = props?.idbParams;

  if (!idbParams || !idbParams.dbName || !idbParams.storeName) {
    idbParams = defaultIDBStoreParams;
  }

  const idbCacheObserver: QueryablePreObserver = async function (
    this: IQueryableInternal,
    url: string,
    init: RequestInit,
    result: any,
  ) {
    let method = init.method || '';
    //@ts-ignore
    let cacheHeader = init.headers && init?.headers['X-PnP-CacheAlways'] ? init?.headers['X-PnP-CacheAlways'] : '';

    // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
    if (/get/i.test(method) || cacheHeader) {
      //@ts-ignore
      const key = init?.headers['X-PnP-CacheKey'] ? init.headers['X-PnP-CacheKey'] : keyFactory(url.toString());
      let idbStorageWrapper = new IDBStorageWrapper(idbParams);
      let indexdbData;

      try {
        indexdbData = await idbStorageWrapper.get(key);
      } catch (err) {
        console.log(`IDBCaching(idbCacheObserver): ${err}.`);
      }

      if (indexdbData == null) {
        //  falling back to network to update cache
        this.on.post(async function (url: URL, result1: any) {
          let expiryDate = expireFunc(url.toString()) || new Date();
          await idbStorageWrapper.put(key, result1, expiryDate);
          return [url, result1];
        });
      } else {
        result = indexdbData;
      }
    }

    return Promise.resolve([url, init, result]);
  };

  return (instance: Queryable) => {
    instance.on.pre(idbCacheObserver);
    return instance;
  };
}
