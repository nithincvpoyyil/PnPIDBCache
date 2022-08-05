export interface ICustomStoreParams {
    dbName: string;
    storeName: string;
}
export interface IIDBValue<T = any> {
    expiry: Date;
    indexedDBCache: number;
    data: T;
}
export declare const DEFAULT_DB_NAME = "IDBStorgeDBForPnP";
export declare const DEFAULT_STORE_NAME = "IDBStorgeDBStoreNameForPnP";
export declare class IDBStorage<T = any> {
    private _idbStore;
    private isIndexedDBError;
    constructor(customStoreparams?: ICustomStoreParams);
    get indexedDBError(): boolean;
    get length(): Promise<number>;
    clear(): Promise<void>;
    getItem(key: string): Promise<T | undefined>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, data: any): Promise<void>;
    getEntries(): Promise<[IDBValidKey, any][]>;
    test(): boolean;
}
