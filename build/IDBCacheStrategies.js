"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheOnly = exports.cacheFirst = exports.staleWhileRevalidateWithExpiry = exports.staleWhileRevalidate = void 0;
var IDBStorage_1 = require("./IDBStorage");
var indexedDBStorageInstance;
/**
 * Stale-while-revalidate caching strategy without expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param dbParams - custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate
 *
 * @example
 * const reponse = await staleWhileRevalidate("key-1", sp.web.select("Title", "Description").get(),{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
function staleWhileRevalidate(key, p, dbParams) {
    return __awaiter(this, void 0, void 0, function () {
        var value, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbParams) {
                        dbParams = { dbName: '', storeName: '' };
                    }
                    if (!indexedDBStorageInstance) {
                        indexedDBStorageInstance = new IDBStorage_1.IDBStorage(dbParams);
                    }
                    if (!!indexedDBStorageInstance.indexedDBError) return [3 /*break*/, 2];
                    return [4 /*yield*/, indexedDBStorageInstance.getItem(key)];
                case 1:
                    value = _a.sent();
                    if (value) {
                        // update cache once we have a result
                        p.then(function (u) {
                            return indexedDBStorageInstance.setItem(key, u);
                        });
                        // response return from cache
                        return [2 /*return*/, value];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, p];
                case 3:
                    result = _a.sent();
                    // Set Cache
                    if (!indexedDBStorageInstance.indexedDBError) {
                        indexedDBStorageInstance.setItem(key, result);
                    }
                    // Return from Promise
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.staleWhileRevalidate = staleWhileRevalidate;
/**
 * Stale-while-revalidate caching strategy with expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param expiry - Date object for the cache expiration. If this value is  not passed, default value will be taken current time + 1 hour
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#stale-while-revalidate
 *
 * @example
 * let expiry = new Date(new Date().getTme()+980000);
 * let request = sp.web.select("Title", "Description").get()
 * const reponse = await staleWhileRevalidateWithExpiry("key-1", request, expiry,{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
function staleWhileRevalidateWithExpiry(key, p, expiry, dbParams) {
    return __awaiter(this, void 0, void 0, function () {
        var expiryDate, value, isExpired, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!indexedDBStorageInstance) {
                        indexedDBStorageInstance = new IDBStorage_1.IDBStorage(dbParams);
                    }
                    if (!dbParams) {
                        dbParams = { dbName: '', storeName: '' };
                    }
                    expiryDate = expiry && typeof Date === 'object' ? expiry : new Date(new Date().getTime() + 1000 * 60 * 10);
                    if (!!indexedDBStorageInstance.indexedDBError) return [3 /*break*/, 2];
                    return [4 /*yield*/, indexedDBStorageInstance.getItem(key)];
                case 1:
                    value = _a.sent();
                    isExpired = value.expiry <= new Date();
                    if (value && value.indexedDBCache && !isExpired) {
                        // update cache once we have a result
                        p.then(function (u) {
                            var response = { expiry: expiryDate, data: u, indexedDBCache: 1 };
                            return indexedDBStorageInstance.setItem(key, response);
                        });
                        // response return from cache
                        return [2 /*return*/, value.data];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, p];
                case 3:
                    result = _a.sent();
                    // Set Cache
                    if (!indexedDBStorageInstance.indexedDBError) {
                        data = { expiry: expiryDate, data: result, indexedDBCache: 1 };
                        indexedDBStorageInstance.setItem(key, data);
                    }
                    // return from promise
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.staleWhileRevalidateWithExpiry = staleWhileRevalidateWithExpiry;
/**
 *
 * cache-first caching strategy with expiration
 *
 * @param key - cache key value for the network request or item
 * @param p - request Promise object to fulfill network request
 * @param expiry - Date object for the cache expiration. If this value is  not passed, default value will be taken current time + 1 hour
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-first-falling-back-to-network
 *
 * @example
 * let expiry = new Date(new Date().getTme()+980000);
 * let request = sp.web.select("Title", "Description").get()
 * const reponse = await cacheFirst("key-1", request, expiry,{dbName:'myAppcacheDB',storeName:'homePage'});
 *
 */
function cacheFirst(key, p, expiry, dbParams) {
    return __awaiter(this, void 0, void 0, function () {
        var expiryDate, value, isExpired, result, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbParams) {
                        dbParams = { dbName: '', storeName: '' };
                    }
                    if (!indexedDBStorageInstance) {
                        indexedDBStorageInstance = new IDBStorage_1.IDBStorage(dbParams);
                    }
                    expiryDate = expiry && typeof Date === 'object' ? expiry : new Date(new Date().getTime() + 1000 * 60 * 10);
                    if (!!indexedDBStorageInstance.indexedDBError) return [3 /*break*/, 2];
                    return [4 /*yield*/, indexedDBStorageInstance.getItem(key)];
                case 1:
                    value = _a.sent();
                    isExpired = value.expiry <= new Date();
                    // Return from Cache
                    if (value && value.indexedDBCache && !isExpired) {
                        return [2 /*return*/, value.data];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, p];
                case 3:
                    result = _a.sent();
                    // Set Cache
                    if (!indexedDBStorageInstance.indexedDBError) {
                        data = { expiry: expiryDate, data: result, indexedDBCache: 1 };
                        indexedDBStorageInstance.setItem(key, data);
                    }
                    // Return from Promise
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.cacheFirst = cacheFirst;
/**
 *
 * cache-only caching strategy with expiration
 *
 *
 * @param key - cache key value for the network request or item
 * @param dbParams - optional custom indexed db store parameters. If this value is not passed, default values will be selected
 * @returns  Promise<T | undefined>
 *
 * Check link for more information: https://developer.chrome.com/docs/workbox/caching-strategies-overview/#cache-only
 *
 * @example
 *
 * const reponse = await cacheOnly("key-1", {dbName:'myAppcacheDB',storeName:'homePage'});
 */
function cacheOnly(key, dbParams) {
    return __awaiter(this, void 0, void 0, function () {
        var value, isExpired;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dbParams) {
                        dbParams = { dbName: '', storeName: '' };
                    }
                    if (!indexedDBStorageInstance) {
                        indexedDBStorageInstance = new IDBStorage_1.IDBStorage(dbParams);
                    }
                    if (!!indexedDBStorageInstance.indexedDBError) return [3 /*break*/, 2];
                    return [4 /*yield*/, indexedDBStorageInstance.getItem(key)];
                case 1:
                    value = _a.sent();
                    isExpired = value.expiry <= new Date();
                    // Return from Cache
                    if (value && value.indexedDBCache && !isExpired) {
                        return [2 /*return*/, value.data];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.cacheOnly = cacheOnly;
