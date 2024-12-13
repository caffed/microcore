[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / HistoryController

# Type Alias: HistoryController\<T, S\>

> **HistoryController**\<`T`, `S`\>: `object`

Name: HistoryController
Description: History Controller object

## Type Parameters

• **T** *extends* [`Json`](Json.md) = [`Json`](Json.md)

• **S** *extends* [`State`](State.md)\<`T`\> = [`State`](State.md)\<`T`\>

## Type declaration

### clear()

> **clear**: () => `void`

#### Returns

`void`

### getHistory()

> **getHistory**: () => `Readonly`\<[`History`](History.md)\<`T`, `S`\>\>

#### Returns

`Readonly`\<[`History`](History.md)\<`T`, `S`\>\>

### getState()

> **getState**: () => `Readonly`\<`S`\>

#### Returns

`Readonly`\<`S`\>

### jumpToFutureRevision()

> **jumpToFutureRevision**: (`revisionId`) => `void` \| `Readonly`\<`S`\>

#### Parameters

##### revisionId

`string`

#### Returns

`void` \| `Readonly`\<`S`\>

### jumpToPastRevision()

> **jumpToPastRevision**: (`revisionId`) => `void` \| `Readonly`\<`S`\>

#### Parameters

##### revisionId

`string`

#### Returns

`void` \| `Readonly`\<`S`\>

### jumpToRevision()

> **jumpToRevision**: (`revisionId`) => `void` \| `Readonly`\<`S`\>

#### Parameters

##### revisionId

`string`

#### Returns

`void` \| `Readonly`\<`S`\>

### redo()

> **redo**: (`steps`?) => `Readonly`\<`S`\>

#### Parameters

##### steps?

`number`

#### Returns

`Readonly`\<`S`\>

### setState()

> **setState**: (`value`) => `Readonly`\<`S`\>

#### Parameters

##### value

`T`

#### Returns

`Readonly`\<`S`\>

### undo()

> **undo**: (`steps`?) => `Readonly`\<`S`\>

#### Parameters

##### steps?

`number`

#### Returns

`Readonly`\<`S`\>

## Template

S

## Defined in

[src/reducer/history.ts:43](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/reducer/history.ts#L43)
