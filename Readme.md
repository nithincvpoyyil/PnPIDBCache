# PnP indexedDB caching

PnP-indexedDB is a cache wrapper util for the PnPv3 library for SPFx web applications. It helps you to use indexeddb as cache storage on your Sahrepoint Sites. It is built using idb-keyval, @pnp/core.

**Backstory**: As per my knowledge, session/local storage allows us to store maximum of 10Mb (varies with browser) of data per domain/host. Due to this storgae limitation, PnPStorageWrapper is throwing 'storage quota exceeded' error. In our case, its a content-heavy website, updated infrequently and hevily relies on caching.

Key features:

- A caching allow us to add idexeddb as a cache storage
- Its a browsers only package - not support for NodeJS
- This enable us to overcome LocalStorage/SessionStorage quota limit per domain

## Installation

```JavaScript
npm install @simpletech/pnp-idb-cache

yarn add @simpletech/pnp-idb-cache
```

## Usage

```JavaScript

/**
 * With default parameters
 * 
 * CacheKey - a random unique id will be generated
 * Expiry - function will return Date object with +24 hours
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
