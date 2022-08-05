import { Queryable } from '@pnp/queryable';
import { TimelinePipe } from '@pnp/core';
export declare type CacheKeyFactory = (url: string) => string;
export declare type CacheExpireFunc = (url: string) => Date;
export interface ICachingProps {
    keyFactory?: CacheKeyFactory;
    expireFunc?: CacheExpireFunc;
}
export declare function IDBCaching(props?: ICachingProps): TimelinePipe<Queryable>;
