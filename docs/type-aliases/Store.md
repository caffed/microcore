[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Store

# Type Alias: Store\<T, S, A\>

> **Store**\<`T`, `S`, `A`\>: `object`

Name: Store
Description: Store API object

## Type Parameters

• **T** *extends* [`Json`](Json.md) = [`Json`](Json.md)

• **S** *extends* [`State`](State.md)\<`T`\> = [`State`](State.md)\<`T`\>

• **A** *extends* [`Action`](Action.md)\<`T`\> = [`Action`](Action.md)\<`T`\>

## Type declaration

### actions

> **actions**: [`ReducerCollection`](ReducerCollection.md)\<`T`, `S`\>

### dispatch

> **dispatch**: [`Callable`](Callable.md)\<`A`, `void`\>

### getState

> **getState**: [`Callable`](Callable.md)\<`null`, `S`\>

### name

> **name**: `string`

### subscribe

> **subscribe**: [`Callable`](Callable.md)\<[`ArrowFunction`](ArrowFunction.md), [`Callable`](Callable.md)\<`null`, `void`\>\>

## Defined in

[src/reducer/store.ts:40](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/reducer/store.ts#L40)
