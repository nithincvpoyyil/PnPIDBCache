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
exports.CachingPessimisticRefresh = void 0;
var core_1 = require("@pnp/core");
/**
 * Pessimistic Caching Behavior
 * Always returns the cached value if one exists but asynchronously executes the call and updates the cache.
 * If a expireFunc is included then the cache update only happens if the cache has expired.
 *
 * @param store Use local or session storage
 * @param keyFactory: a function that returns the key for the cache value, if not provided a default hash of the url will be used
 * @param expireFunc: a function that returns a date of expiration for the cache value, if not provided the cache never expires but is always updated.
 */
function CachingPessimisticRefresh(type, keyFactory, expireFunc) {
    if (type === void 0) { type = 'session'; }
    var store;
    if (type === 'session') {
        store = typeof sessionStorage === 'undefined' ? new MemoryStorage() : sessionStorage;
    }
    else {
        store = typeof localStorage === 'undefined' ? new MemoryStorage() : localStorage;
    }
    if (!(0, core_1.isFunc)(keyFactory)) {
        keyFactory = function (url) { return (0, core_1.getHashCode)(url.toLowerCase()).toString(); };
    }
    var putStorage = function (key, o) {
        try {
            if ((0, core_1.isFunc)(expireFunc)) {
                var storage = new core_1.PnPClientStorage();
                var s = type === 'session' ? storage.session : storage.local;
                s.put(key, o, expireFunc());
            }
            else {
                var cache = JSON.stringify({ pnp: 1, expiration: undefined, value: o });
                store.setItem(key, cache);
            }
        }
        catch (err) {
            console.log("CachingPessimistic(putStorage): ".concat(err, "."));
        }
    };
    var getStorage = function (key) {
        var retVal = undefined;
        try {
            if ((0, core_1.isFunc)(expireFunc)) {
                var storage = new core_1.PnPClientStorage();
                var s = type === 'session' ? storage.session : storage.local;
                retVal = s.get(key);
            }
            else {
                var cache = store.getItem(key);
                if (typeof cache === 'string') {
                    retVal = JSON.parse(cache);
                }
            }
        }
        catch (err) {
            console.log("CachingPessimistic(getStorage): ".concat(err, "."));
        }
        return retVal;
    };
    var refreshCache = true;
    return function (instance) {
        instance.on.init(function (that) {
            var newExecute = (0, core_1.extend)(that, {
                execute: function (userInit) {
                    if (userInit === void 0) { userInit = { method: 'GET', headers: {} }; }
                    return __awaiter(this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var requestId, emitError, retVal_1, emitSend_1, emitData, _a, requestUrl_1, init_1, result_1, e_1;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            requestId = (0, core_1.getGUID)();
                                            emitError = function (e) {
                                                // this.log(`[id:${requestId}] Emitting error: "${e.message || e}"`, 3);
                                                _this.emit.error(e);
                                                // this.log(`[id:${requestId}] Emitted error: "${e.message || e}"`, 3);
                                            };
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 6, 7, 8]);
                                            retVal_1 = undefined;
                                            emitSend_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                                var response;
                                                var _a, _b, _c;
                                                return __generator(this, function (_d) {
                                                    switch (_d.label) {
                                                        case 0: return [4 /*yield*/, that.emit.auth(requestUrl_1, init_1)];
                                                        case 1:
                                                            // that.log(`[id:${requestId}] Emitting auth`, 0);
                                                            _a = _d.sent(), requestUrl_1 = _a[0], init_1 = _a[1];
                                                            // that.log(`[id:${requestId}] Emitted auth`, 0);
                                                            // we always resepect user supplied init over observer modified init
                                                            init_1 = __assign(__assign(__assign({}, init_1), userInit), { headers: __assign(__assign({}, init_1.headers), userInit.headers) });
                                                            return [4 /*yield*/, that.emit.send(requestUrl_1, init_1)];
                                                        case 2:
                                                            response = _d.sent();
                                                            return [4 /*yield*/, that.emit.parse(requestUrl_1, response, result_1)];
                                                        case 3:
                                                            // that.log(`[id:${requestId}] Emitted send`, 0);
                                                            // that.log(`[id:${requestId}] Emitting parse`, 0);
                                                            _b = _d.sent(), requestUrl_1 = _b[0], response = _b[1], result_1 = _b[2];
                                                            return [4 /*yield*/, that.emit.post(requestUrl_1, result_1)];
                                                        case 4:
                                                            // that.log(`[id:${requestId}] Emitted parse`, 0);
                                                            // that.log(`[id:${requestId}] Emitting post`, 0);
                                                            _c = _d.sent(), requestUrl_1 = _c[0], result_1 = _c[1];
                                                            // that.log(`[id:${requestId}] Emitted post`, 0);
                                                            return [2 /*return*/, result_1];
                                                    }
                                                });
                                            }); };
                                            emitData = function () {
                                                // that.log(`[id:${requestId}] Emitting data`, 0);
                                                that.emit.data(retVal_1);
                                                // that.log(`[id:${requestId}] Emitted data`, 0);
                                            };
                                            return [4 /*yield*/, that.emit.pre(that.toRequestUrl(), {}, undefined)];
                                        case 2:
                                            _a = _b.sent(), requestUrl_1 = _a[0], init_1 = _a[1], result_1 = _a[2];
                                            // that.log(`[id:${requestId}] Url: ${requestUrl}`, 1);
                                            if (typeof result_1 !== 'undefined') {
                                                retVal_1 = result_1;
                                            }
                                            if (!(retVal_1 !== undefined)) return [3 /*break*/, 3];
                                            if (refreshCache) {
                                                // Return value exists -> assume lazy cache update pipeline execution.
                                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                    var e_2;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                _a.trys.push([0, 2, , 3]);
                                                                return [4 /*yield*/, emitSend_1()];
                                                            case 1:
                                                                _a.sent();
                                                                return [3 /*break*/, 3];
                                                            case 2:
                                                                e_2 = _a.sent();
                                                                emitError(e_2);
                                                                return [3 /*break*/, 3];
                                                            case 3: return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, 0);
                                            }
                                            // that.log(`[id:${requestId}] Returning cached results and updating cache async`, 1);
                                            emitData();
                                            return [3 /*break*/, 5];
                                        case 3: return [4 /*yield*/, emitSend_1()];
                                        case 4:
                                            retVal_1 = _b.sent();
                                            // that.log(`[id:${requestId}] Returning results`, 1);
                                            emitData();
                                            _b.label = 5;
                                        case 5: return [3 /*break*/, 8];
                                        case 6:
                                            e_1 = _b.sent();
                                            emitError(e_1);
                                            return [3 /*break*/, 8];
                                        case 7: return [7 /*endfinally*/];
                                        case 8: return [2 /*return*/];
                                    }
                                });
                            }); }, 0);
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    that.on[that.InternalResolveEvent].replace(resolve);
                                    that.on[that.InternalRejectEvent].replace(reject);
                                })];
                        });
                    });
                },
            });
            return newExecute;
        });
        instance.on.pre(function (that, url, init, result) {
            // Reset refreshCache
            refreshCache = true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            var key = keyFactory(url.toString());
            var cached = getStorage(key);
            if (cached !== undefined) {
                // Return value
                result = cached.value;
                if (cached.expiration !== undefined) {
                    if (new Date(cached.expiration) > new Date()) {
                        refreshCache = false;
                    }
                }
            }
            // in these instances make sure we update cache after retrieving result
            if (refreshCache) {
                // if we don't have a cached result we need to get it after the request is sent and parsed
                that.on.post(function (url, result) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            putStorage(key, result);
                            return [2 /*return*/, [url, result]];
                        });
                    });
                });
            }
            return [url, init, result];
        });
        return instance;
    };
}
exports.CachingPessimisticRefresh = CachingPessimisticRefresh;
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
