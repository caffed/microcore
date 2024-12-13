[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createStore

# Function: createStore()

> **createStore**\<`T`, `S`\>(`params`): [`Store`](../type-aliases/Store.md)\<`T`, `S`, [`Action`](../type-aliases/Action.md)\<`T`\>\>

Name: createStore
Description: createStore API constructor

## Type Parameters

• **T** *extends* [`Json`](../type-aliases/Json.md) = [`Json`](../type-aliases/Json.md)

• **S** *extends* [`State`](../type-aliases/State.md)\<`T`\> = [`State`](../type-aliases/State.md)\<`T`\>

## Parameters

### params

`StoreParams`\<`T`, `S`\> & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md)

StoreParams<T, S> & MiddlewareParams

## Returns

[`Store`](../type-aliases/Store.md)\<`T`, `S`, [`Action`](../type-aliases/Action.md)\<`T`\>\>

Store<T, S>

## Defined in

[src/reducer/store.ts:104](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/reducer/store.ts#L104)
