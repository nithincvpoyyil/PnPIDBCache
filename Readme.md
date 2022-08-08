# PnPJS indexedDB caching support

**@simpletech/pnp-idb-cache** is a cache wrapper utility for the PnPJS v3 library. Current PnPJs v3 does not have support for indexedDB as cache storage and this library helps you to use indexeddb as cache storage on your Sharepoint sites. It is built using idb-keyval & @pnp/core.

**Backstory**: From my knowledge, session/local storage allows us to store a maximum of 10Mb (varies with browser) data per domain/host. Due to this limitation, PnPStorageWrapper will throw a 'storage quota exceeded' error if the storage is full. I'm developing a content-heavy site that relies heavily on caching, so, I've decided to create an indexedDB caching wrapper for the PnPJS. Please check this thread [ PnP feature request](https://github.com/pnp/pnpjs/issues/2046) for more details.

Key features:
- It allows us to add indexed as a cache storage
- Supports browsers only (NodeJS - not supported).
- Deletes expired cache items
- Customizable cache expiry, cache key functions & DB parameters
- More storage capacity than storage APIs

## Installation

```JavaScript
npm install @simpletech/pnp-idb-cache

yarn add @simpletech/pnp-idb-cache

```

## Usage

Check [demo project](https://github.com/nithincvpoyyil/idb-cache-spfx) for the SPFx implementation

```JavaScript

import { IDBCaching } from "@simpletech/pnp-idb-cache";


/**
 * With default parameters
 *
 * if you have not passed any cache parameters, it'll fallback to default parameters as follows
 *
 * keyFactory - a random unique id will be generated as cacheKey
 * expireFunc -  default function, returns Date object with +24 hours
 * dbParams - default DB and table name will be used.
 *
 * */
function getItems() {
    sp = spfi().using(SPFx(this.context));

    // get all the items from a list
    sp.web.lists
      // go with default cache params and expiry(24 hours) function
      .using(IDBCaching())
      .getByTitle("someListNameInTheSPSite")
      .items()
      .then(
        (items) => {
          console.log("data fetch completed", items);
        },
        () => {
          console.log("data fetch failed");
        }
      );

  }


/**
 * With custom caching parameters
 *
 * expiry function - returning Date object with +30 seconds
 * keyFactory - to return custom key
 * idbParams - for custom indexeddb params - DB name and table name for cache storage
 *
 * */
let cachingParams ={
          expireFunc: () => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 30); // next 30 seconds
            return time;
          },
          keyFactory: () => "data-key-3",
          idbParams: { dbName: "customDBName", storeName: "customDBStoreName" }
};

function getPageProperties() {
    sp = spfi().using(SPFx(this.context));
    return sp.web.lists
      .using(IDBCaching(cachingParams))
      .getById(this.context.pageContext.list.id.toString())
      .items.getById(this.context.pageContext.listItem.id)()
}


```

## Contributing

Fork it! & submit your PR

## History

Version 1.1.0 (08/08/2022) - Initial version

## License

The MIT License (MIT)

Copyright (c) 2022 Nithin C Valappil

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
