import { IQueryableInternal, Queryable, QueryablePreObserver } from '@pnp/queryable';
import { getHashCode, dateAdd, TimelinePipe } from '@pnp/core';
import { ICustomStoreParams, IDBStorageWrapper } from './IDBStorage';

let idbStorageWrapper: IDBStorageWrapper;

export type CacheKeyFactory = (url: string) => string;
export type CacheExpireFunc = (url: string) => Date;

export interface ICachingProps {
  keyFactory?: CacheKeyFactory;
  expireFunc?: CacheExpireFunc;
  idbParams?: ICustomStoreParams;
}

export function IDBCaching(props?: ICachingProps): TimelinePipe<Queryable> {
  const { keyFactory, expireFunc, idbParams } = {
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

    // only cache get requested data or where the CacheAlways header is present (allows caching of POST requests)
    if (/get/i.test(method) || cacheHeader) {
      //@ts-ignore
      const key = init?.headers['X-PnP-CacheKey'] ? init.headers['X-PnP-CacheKey'] : keyFactory(url.toString());

      if (!idbStorageWrapper) {
        idbStorageWrapper = new IDBStorageWrapper(idbParams);
      }

      let indexdbData = await idbStorageWrapper.get(key);

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
