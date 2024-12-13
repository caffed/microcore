[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createMapCache

# Function: createMapCache()

> **createMapCache**\<`K`, `V`\>(`params`): [`Cache`](../interfaces/Cache.md)\<`K`, `V`\>

Function:
Name:  createMapCache
Description: MapCache implementation with middleware support
Implements: {Cache<K, V>}

## Type Parameters

• **K** = [`MapHashKey`](../type-aliases/MapHashKey.md)

• **V** = `any`

## Parameters

### params

`MapCacheParams` & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md) = `{}`

MapCacheParams & MiddlewareParams<AnyObject, any>

## Returns

[`Cache`](../interfaces/Cache.md)\<`K`, `V`\>

Cache<K, V> interface

## Defined in

[src/cache/cache.ts:119](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L119)
