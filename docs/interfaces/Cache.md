[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Cache

# Interface: Cache\<K, V\>

Name:  Cache
Description:  API interface for Cache implementations

## Type Parameters

• **K**

• **V**

## Properties

### clear()

> **clear**: () => `void`

#### Returns

`void`

#### Defined in

[src/cache/cache.ts:26](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L26)

***

### getValue()

> **getValue**: (`key`) => `Readonly`\<`V`\>

#### Parameters

##### key

`K`

#### Returns

`Readonly`\<`V`\>

#### Defined in

[src/cache/cache.ts:28](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L28)

***

### hasValue()

> **hasValue**: (`key`) => `boolean`

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Defined in

[src/cache/cache.ts:29](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L29)

***

### length

> **length**: `number`

#### Defined in

[src/cache/cache.ts:27](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L27)

***

### name

> **name**: `string`

#### Defined in

[src/cache/cache.ts:30](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L30)

***

### removeValue()

> **removeValue**: (`key`) => `boolean`

#### Parameters

##### key

`K`

#### Returns

`boolean`

#### Defined in

[src/cache/cache.ts:31](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L31)

***

### setValue()

> **setValue**: (`key`, `value`) => `void`

#### Parameters

##### key

`K`

##### value

`V`

#### Returns

`void`

#### Defined in

[src/cache/cache.ts:32](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/cache/cache.ts#L32)
