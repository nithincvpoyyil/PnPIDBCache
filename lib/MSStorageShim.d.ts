export declare function getStorageShim(): MemoryStorage;
export declare class MemoryStorage {
    private _store;
    constructor(_store?: Map<string, any>);
    [key: string]: any;
    [index: number]: string;
    get length(): number;
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
