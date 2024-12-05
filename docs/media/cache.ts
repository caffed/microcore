/**
 * @module cache
 * Description: A key-value data storage and retrieval framework
 */
import {
  createMiddlewareApi,
  type MiddlewareParams,
} from "../middleware";
import {
  MapHashKey,
} from "../types";
import {
  randomString,
} from "../utils";
import {
  mapCacheApi,
} from './middleware';

/**
 * Name:  Cache
 * Description:  API interface for Cache implementations
 * @public
 * @interface {Cache<K, V>}
 */
export interface Cache<K, V> {
  clear: () => void;
  length: number;
  getValue: (key: K) => Readonly<V>;
  hasValue: (key: K) => boolean;
  name: Readonly<string>;
  removeValue: (key: K) => boolean;
  setValue: (key: K, value: V) => void;
}

/**
 * Name: CACHE_ACTIONS
 * Description: Cache actions to be used for reducers or similar
 * @public
 * @readonly
 * @enum {string}
 */
export enum CACHE_ACTIONS {
  CACHE_CLEAR = 'CACHE_CLEAR',
  CACHE_GET_VALUE = 'CACHE_GET_VALUE',
  CACHE_HAS_VALUE = 'CACHE_HAS_VALUE',
  CACHE_LENGTH = 'CACHE_LENGTH',
  CACHE_REMOVE_VALUE = 'CACHE_REMOVE_VALUE',
  CACHE_SET_VALUE = 'CACHE_SET_VALUE',
};

/**
 * Name: MapCacheParams
 * Description: MapCache params
 * @private
 * @typedef {Object}
 * @property {string} name - Cache name
 */
type MapCacheParams = {
  name?: string;
};

/**
 * Name:  MapCache
 * Classdesc: Default cache implementation
 * @public
 * @class
 * Implements: {Cache<K, V>}
 */
export class MapCache<K = MapHashKey, V = any> implements Cache<K, V> {
  private cache = new Map<K, V>();
  private cacheName: Readonly<string>;

  constructor(params: MapCacheParams = {}) {
    const { name = randomString() } = params;
    this.cacheName = name;
  }

  get length(): number {
    let counter = 0;
    for(const _ of this.cache.keys()) {
      counter += 1;
    }
    return counter;
  }

  hasValue(key: K): boolean {
    return this.cache.has(key);
  }

  get name(): string {
    return this.cacheName;
  }

  setValue(key: K, value: V): void {
    this.cache.set(key, value);
  }

  getValue(key: K): V {
    return this.cache.get(key);
  }

  removeValue(key: K): boolean {
    return this.cache.delete(key);
  }
  
  clear(): void {
    this.cache = new Map<K, V>();
  }
}

/**
 * Function:
 * Name:  createMapCache
 * Description: MapCache implementation with middleware support
 * Implements: {Cache<K, V>}
 * @param params MapCacheParams & MiddlewareParams<AnyObject, any>
 * @returns Cache<K, V> interface
 */
export function createMapCache<
  K = MapHashKey,
  V = any
>(params: MapCacheParams & MiddlewareParams = {}): Cache<K, V> {
  const {
    createApi,
    middleware = [{ middleware: mapCacheApi<K, V> }],
    sort,
    transform,
    name = randomString(),
  } = params;

  let cache = new Map<K, V>();
  const cacheName = name;
  const api = createMiddlewareApi({
    createApi,
    middleware,
    sort,
    transform,
  });

  return {
    clear(): void {
      const { result } = api({
        action: {
          type: CACHE_ACTIONS.CACHE_CLEAR,
        }}).middleware({ cache });
      cache = result;
    },
    getValue(key: K): Readonly<V> {
      const { result } = api({
        action: {
          type: CACHE_ACTIONS.CACHE_GET_VALUE,
        }}).middleware({ cache, key });
      return result;
    },
    hasValue(key: K): boolean {
      const { result } = api({
        action: {
          type: CACHE_ACTIONS.CACHE_HAS_VALUE,
        }}).middleware({ cache, key });
      return result;
    },
    get length(): number {
      const { result } = api({
        action: {
          type: CACHE_ACTIONS.CACHE_LENGTH,
        }}).middleware({ cache });
      return result;
    },
    get name(): Readonly<string> {
      return cacheName;
    },
    removeValue(key: K): boolean {
      const { result } = api({
        action: {
          type: CACHE_ACTIONS.CACHE_REMOVE_VALUE,
        }}).middleware({ cache, key });
      return result;
    },
    setValue(key: K, value: V): void {
      api({
        action: {
          type: CACHE_ACTIONS.CACHE_SET_VALUE,
        }}).middleware({ cache, key, value });
    },
  };
};
