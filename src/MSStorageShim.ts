let storageShim: MemoryStorage | undefined;

export function getStorageShim(): MemoryStorage {
  if (typeof storageShim === 'undefined') {
    storageShim = new MemoryStorage();
  }
  return storageShim;
}

export class MemoryStorage {
  constructor(private _store = new Map<string, any>()) {}

  [key: string]: any;
  [index: number]: string;

  public get length(): number {
    return this._store.size;
  }

  public clear(): void {
    this._store.clear();
  }

  public getItem(key: string): any {
    return this._store.get(key);
  }

  public key(index: number): string {
    return Array.from(this._store)[index][0];
  }

  public removeItem(key: string): void {
    this._store.delete(key);
  }

  public setItem(key: string, data: string): void {
    this._store.set(key, data);
  }
}
