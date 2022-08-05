import { set, get, clear, createStore, UseStore, keys, del, entries } from 'idb-keyval';

export interface ICustomStoreParams {
  dbName: string;
  storeName: string;
}

export interface IIDBValue<T = any> {
  expiry: Date;
  indexedDBCache: number;
  data: T;
}

export const DEFAULT_DB_NAME = 'IDBStorgeDBForPnP';
export const DEFAULT_STORE_NAME = 'IDBStorgeDBStoreNameForPnP';

export class IDBStorage<T = any> {
  private _idbStore: UseStore | undefined;
  private isIndexedDBError: boolean = false;

  constructor(customStoreparams?: ICustomStoreParams) {
    if (!window.indexedDB) {
      this.isIndexedDBError = true;
    }
    if (customStoreparams && customStoreparams.dbName && customStoreparams.storeName) {
      this._idbStore = createStore(customStoreparams.dbName, customStoreparams.storeName);
    } else {
      this._idbStore = createStore(DEFAULT_DB_NAME, DEFAULT_STORE_NAME);
    }
  }

  public get indexedDBError(): boolean {
    return this.isIndexedDBError;
  }

  public get length(): Promise<number> {
    return (async () => {
      let keyList = await keys(this._idbStore);
      return keyList.length;
    })();
  }

  public clear(): Promise<void> {
    return clear(this._idbStore);
  }

  public getItem(key: string): Promise<T | undefined> {
    return get(key, this._idbStore);
  }

  public removeItem(key: string): Promise<void> {
    return del(key, this._idbStore);
  }

  public setItem(key: string, data: any): Promise<void> {
    return set(key, data, this._idbStore);
  }

  public getEntries(): Promise<[IDBValidKey, any][]> {
    return entries(this._idbStore);
  }

  public test(): boolean {
    return !!window.indexedDB;
  }
}
