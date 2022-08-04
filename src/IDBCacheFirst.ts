import { ICustomStoreParams, IDBStorage } from './IDBStorage';

let indexedDBStorageInstance: IDBStorage;

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
      // Update Cache once we have a result
      p.then((u) => {
        return indexedDBStorageInstance.setItem(key, u);
      });

      // Return from Cache
      return value;
    }
  }

  // Not In Cache so we need to wait for the value
  const result = await p;

  // Set Cache
  if (!indexedDBStorageInstance.indexedDBError) {
    indexedDBStorageInstance.setItem(key, result);
  }

  // Return from Promise
  return result;
}
