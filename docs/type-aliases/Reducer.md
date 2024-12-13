[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Reducer

# Type Alias: Reducer\<T, S\>

> **Reducer**\<`T`, `S`\>: `object`

Name: Reducer
Description: Reducer API object

## Type Parameters

• **T** *extends* [`Json`](Json.md) = [`Json`](Json.md)

• **S** *extends* [`State`](State.md)\<`T`\> = [`State`](State.md)\<`T`\>

## Type declaration

### dispatch()

> **dispatch**: (`state`, `action`) => `S`

#### Parameters

##### state

`S`

##### action

[`Action`](Action.md)\<`T`\>

#### Returns

`S`

### getAction()

> **getAction**: (`name`) => [`ReducerAction`](ReducerAction.md)\<`T`, `S`\>

#### Parameters

##### name

`string` | `symbol`

#### Returns

[`ReducerAction`](ReducerAction.md)\<`T`, `S`\>

### getAllActions()

> **getAllActions**: () => `Record`\<`string` \| `symbol`, [`ReducerAction`](ReducerAction.md)\<`T`, `S`\>\>

#### Returns

`Record`\<`string` \| `symbol`, [`ReducerAction`](ReducerAction.md)\<`T`, `S`\>\>

### hasAction()

> **hasAction**: (`name`) => `boolean`

#### Parameters

##### name

`string` | `symbol`

#### Returns

`boolean`

### name

> **name**: `string`

### removeAction()

> **removeAction**: (`name`) => `void`

#### Parameters

##### name

`string` | `symbol`

#### Returns

`void`

### removeAllActions()

> **removeAllActions**: () => `void`

#### Returns

`void`

### setAction()

> **setAction**: (`name`, `action`) => `void`

#### Parameters

##### name

`string` | `symbol`

##### action

[`ReducerAction`](ReducerAction.md)\<`T`, `S`\>

#### Returns

`void`

### setActions()

> **setActions**: (`actions`) => `void`

#### Parameters

##### actions

`Record`\<`string` \| `symbol`, [`ReducerAction`](ReducerAction.md)\<`T`, `S`\>\>

#### Returns

`void`

## Defined in

[src/reducer/reducer.ts:22](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/reducer/reducer.ts#L22)
