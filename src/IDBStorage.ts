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

export const defaultIDBStoreParams: ICustomStoreParams = { dbName: DEFAULT_DB_NAME, storeName: DEFAULT_STORE_NAME };

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

export class IDBStorageWrapper {
  private idbStorage: IDBStorage;

  constructor(private customStoreparams?: ICustomStoreParams) {
    if (!customStoreparams || !customStoreparams.dbName || !customStoreparams.storeName) {
      this.customStoreparams = defaultIDBStoreParams;
    }
    this.idbStorage = new IDBStorage(this.customStoreparams);
  }

  /**
   * Get value from underlying storage by key
   *
   * @param key
   * @returns
   */
  public get<T = any>(key: string): Promise<T | null | undefined> {
    return new Promise<T | null | undefined>((resolve, reject) => {
      if (this.idbStorage.indexedDBError) {
        resolve(null);
      }

      this.idbStorage
        .getItem(key)
        .then(async (idbData: IIDBValue) => {
          if (idbData && idbData.indexedDBCache) {
            let isExpired = idbData.expiry <= new Date();
            if (isExpired) {
              await this.delete(key);
              return null;
            } else {
              return idbData.data as T;
            }
          }
        })
        .then(
          (data: T | null | undefined) => {
            resolve(data);
          },
          () => {
            resolve(null);
          },
        );
    });
  }

  /**
   * Adds a value to the underlying storage
   *
   * @param key The key to use when storing the provided value
   * @param o The value to store
   * @param expiry adds expiry date
   */
  public async put(key: string, o: any, expiry: Date): Promise<void> {
    if (this.idbStorage.indexedDBError) {
      return Promise.resolve();
    }
    try {
      let toIDBStore: IIDBValue = { expiry, data: o, indexedDBCache: 1 };
      return this.idbStorage.setItem(key, toIDBStore);
    } catch {
      return Promise.reject();
    }
  }

  /**
   * Deletes a value from the underlying storage
   *
   * @param key The key of the pair we want to remove from storage
   */
  public delete(key: string): Promise<void> {
    if (this.idbStorage.indexedDBError) {
      return Promise.resolve();
    }
    return this.idbStorage.removeItem(key);
  }

  /**
   * Deletes any expired items
   */
  public deleteExpired(): Promise<void> {
    if (this.idbStorage.indexedDBError) {
      return Promise.resolve();
    }
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.idbStorage.clear().then(
          () => {
            resolve();
          },
          () => {
            reject();
          },
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}
