/**
 * @module cache/middleware
 * Description:  Default middleware for use with cache
 */
import type {
  AnyObject,
} from "../types";

/**
 * Name: mapCacheApi
 * Description:  Middleware that implments the Cache interface
 * @implements {Cache}
 * @param api
 * @returns Cache<K, V> api
 */
export const mapCacheApi = <K, V>(api: AnyObject) => {
  return (middleware: any) => {
    return (params: AnyObject) => {
      const { action } = api;
      const {
        cache,
        key,
        value,
      } = params;
      switch(action?.type) {
        case 'CACHE_CLEAR': {
          return middleware({
            ...params,
            result: new Map<K, V>(),
          });
        }
        case 'CACHE_GET_VALUE': {
          return middleware({
            ...params,
            result: cache.get(key),
          });
        }
        case 'CACHE_HAS_VALUE': {
          return middleware({
            ...params,
            result: cache.has(key),
          });
        }
        case 'CACHE_LENGTH': {
          let length = 0;
          for(const _ of cache.keys()) {
            length += 1;
          }
          return middleware({
            ...params,
            result: length,
          });
        }
        case 'CACHE_REMOVE_VALUE': {
          return middleware({
            ...params,
            result: cache.delete(key, value),
          });
        }
        case 'CACHE_SET_VALUE': {
          cache.set(key, value);
          return middleware({...params});
        }
        default: {
          return middleware(params);
        }
      };
    };
  }
};