"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStorage = exports.getStorageShim = void 0;
var storageShim;
function getStorageShim() {
    if (typeof storageShim === 'undefined') {
        storageShim = new MemoryStorage();
    }
    return storageShim;
}
exports.getStorageShim = getStorageShim;
var MemoryStorage = /** @class */ (function () {
    function MemoryStorage(_store) {
        if (_store === void 0) { _store = new Map(); }
        this._store = _store;
    }
    Object.defineProperty(MemoryStorage.prototype, "length", {
        get: function () {
            return this._store.size;
        },
        enumerable: false,
        configurable: true
    });
    MemoryStorage.prototype.clear = function () {
        this._store.clear();
    };
    MemoryStorage.prototype.getItem = function (key) {
        return this._store.get(key);
    };
    MemoryStorage.prototype.key = function (index) {
        return Array.from(this._store)[index][0];
    };
    MemoryStorage.prototype.removeItem = function (key) {
        this._store.delete(key);
    };
    MemoryStorage.prototype.setItem = function (key, data) {
        this._store.set(key, data);
    };
    return MemoryStorage;
}());
exports.MemoryStorage = MemoryStorage;
