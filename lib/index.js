"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.staleWhileRevalidateWithExpiry = exports.cacheOnly = exports.cacheFirst = exports.staleWhileRevalidate = void 0;
var IDBCacheStrategies_1 = require("./IDBCacheStrategies");
Object.defineProperty(exports, "staleWhileRevalidate", { enumerable: true, get: function () { return IDBCacheStrategies_1.staleWhileRevalidate; } });
Object.defineProperty(exports, "cacheFirst", { enumerable: true, get: function () { return IDBCacheStrategies_1.cacheFirst; } });
Object.defineProperty(exports, "cacheOnly", { enumerable: true, get: function () { return IDBCacheStrategies_1.cacheOnly; } });
Object.defineProperty(exports, "staleWhileRevalidateWithExpiry", { enumerable: true, get: function () { return IDBCacheStrategies_1.staleWhileRevalidateWithExpiry; } });
function test() {
    return 1;
}
exports.test = test;
