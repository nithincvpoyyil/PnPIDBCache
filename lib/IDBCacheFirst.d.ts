import { ICustomStoreParams } from './IDBStorage';
export declare function staleWhileRevalidate<T>(key: string, p: Promise<T>, dbParams?: ICustomStoreParams): Promise<T>;
