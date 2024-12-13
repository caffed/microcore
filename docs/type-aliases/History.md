[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / History

# Type Alias: History\<T, S\>

> **History**\<`T`, `S`\>: `object`

Name: History
Description: History object

## Type Parameters

• **T** *extends* [`Json`](Json.md) = [`Json`](Json.md)

• **S** *extends* [`State`](State.md)\<`T`\> = [`State`](State.md)\<`T`\>

## Type declaration

### current

> **current**: `undefined` \| `S`

### future

> **future**: `S`[]

### past

> **past**: `S`[]

## Defined in

[src/reducer/history.ts:25](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/reducer/history.ts#L25)
