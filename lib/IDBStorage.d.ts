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
export declare class IDBStorageWrapper {
    private customStoreparams?;
    private idbStorage;
    constructor(customStoreparams?: ICustomStoreParams | undefined);
    /**
     * Get value from underlying storage by key
     *
     * @param key
     * @returns
     */
    get<T = any>(key: string): Promise<T | null | undefined>;
    /**
     * Adds a value to the underlying storage
     *
     * @param key The key to use when storing the provided value
     * @param o The value to store
     * @param expiry adds expiry date
     */
    put(key: string, o: any, expiry: Date): Promise<void>;
    /**
     * Deletes a value from the underlying storage
     *
     * @param key The key of the pair we want to remove from storage
     */
    delete(key: string): Promise<void>;
    /**
     * Deletes any expired items
     */
    deleteExpired(): Promise<void>;
}
