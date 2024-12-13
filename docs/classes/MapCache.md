[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / MapCache

# Class: MapCache\<K, V\>

Name:  MapCache
Classdesc: Default cache implementation

Implements: {Cache<K, V>}

## Type Parameters

• **K** = [`MapHashKey`](../type-aliases/MapHashKey.md)

• **V** = `any`

## Implements

- [`Cache`](../interfaces/Cache.md)\<`K`, `V`\>

## Constructors

### new MapCache()

> **new MapCache**\<`K`, `V`\>(`params`): [`MapCache`](MapCache.md)\<`K`, `V`\>

#### Parameters

##### params

`MapCacheParams` = `{}`

#### Returns

[`MapCache`](MapCache.md)\<`K`, `V`\>

#### Defined in

[src/cache/cache.ts:73](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L73)

## Accessors

### length

#### Get Signature

> **get** **length**(): `number`

##### Returns

`number`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`length`](../interfaces/Cache.md#length)

#### Defined in

[src/cache/cache.ts:78](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L78)

***

### name

#### Get Signature

> **get** **name**(): `string`

##### Returns

`string`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`name`](../interfaces/Cache.md#name)

#### Defined in

[src/cache/cache.ts:90](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L90)

## Methods

### clear()

> **clear**(): `void`

#### Returns

`void`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`clear`](../interfaces/Cache.md#clear)

#### Defined in

[src/cache/cache.ts:106](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L106)

***

### getValue()

> **getValue**(`key`): `V`

#### Parameters

##### key

`K`

#### Returns

`V`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`getValue`](../interfaces/Cache.md#getvalue)

#### Defined in

[src/cache/cache.ts:98](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L98)

***

### hasValue()

> **hasValue**(`key`): `boolean`

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`hasValue`](../interfaces/Cache.md#hasvalue)

#### Defined in

[src/cache/cache.ts:86](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L86)

***

### removeValue()

> **removeValue**(`key`): `boolean`

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`removeValue`](../interfaces/Cache.md#removevalue)

#### Defined in

[src/cache/cache.ts:102](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L102)

***

### setValue()

> **setValue**(`key`, `value`): `void`

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`void`

#### Implementation of

[`Cache`](../interfaces/Cache.md).[`setValue`](../interfaces/Cache.md#setvalue)

#### Defined in

[src/cache/cache.ts:94](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L94)
