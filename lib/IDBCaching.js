"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.IDBCaching = void 0;
var core_1 = require("@pnp/core");
var IDBStorage_1 = require("./IDBStorage");
var indexedDBStorageInstance;
function IDBCaching(props) {
    var _a = __assign({ keyFactory: function (url) { return (0, core_1.getHashCode)(url.toLowerCase()).toString(); }, expireFunc: function () { return (0, core_1.dateAdd)(new Date(), 'minute', 24 * 60); } }, props), keyFactory = _a.keyFactory, expireFunc = _a.expireFunc;
    var idbCacheObserver = function (url, init, result) {
        return __awaiter(this, void 0, void 0, function () {
            var method, cacheHeader, indexdbData, isExpired, key_1, dbParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = init.method || '';
                        cacheHeader = init.headers && (init === null || init === void 0 ? void 0 : init.headers['X-PnP-CacheAlways']) ? init === null || init === void 0 ? void 0 : init.headers['X-PnP-CacheAlways'] : '';
                        indexdbData = undefined;
                        isExpired = false;
                        if (!(/get/i.test(method) || cacheHeader)) return [3 /*break*/, 3];
                        key_1 = (init === null || init === void 0 ? void 0 : init.headers['X-PnP-CacheKey']) ? init.headers['X-PnP-CacheKey'] : keyFactory(url.toString());
                        dbParams = { dbName: IDBStorage_1.DEFAULT_DB_NAME, storeName: IDBStorage_1.DEFAULT_STORE_NAME };
                        if (!indexedDBStorageInstance) {
                            indexedDBStorageInstance = new IDBStorage_1.IDBStorage(dbParams);
                        }
                        if (!!indexedDBStorageInstance.indexedDBError) return [3 /*break*/, 2];
                        return [4 /*yield*/, indexedDBStorageInstance.getItem(key_1)];
                    case 1:
                        indexdbData = (_a.sent());
                        _a.label = 2;
                    case 2:
                        if (!indexedDBStorageInstance.indexedDBError && indexdbData) {
                            isExpired = indexdbData.expiry <= new Date();
                        }
                        if ((indexdbData === null || indexdbData === void 0 ? void 0 : indexdbData.indexedDBCache) && !isExpired) {
                            result = indexdbData.data;
                        }
                        else {
                            this.on.post(function (url, result1) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var expiryDate, toIDBStore;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                expiryDate = expireFunc(url.toString()) || new Date();
                                                toIDBStore = { expiry: expiryDate, data: result1, indexedDBCache: 1 };
                                                return [4 /*yield*/, indexedDBStorageInstance.setItem(key_1, toIDBStore)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/, [url, result]];
                                        }
                                    });
                                });
                            });
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve([url, init, result])];
                }
            });
        });
    };
    return function (instance) {
        instance.on.pre(idbCacheObserver);
        return instance;
    };
}
exports.IDBCaching = IDBCaching;
