[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / jsonObjectCopy

# Function: jsonObjectCopy()

> **jsonObjectCopy**\<`T`, `K`, `O`\>(`value`): `Record`\<`K`, `O`\>

Name: jsonObjectCopy
Description: Typed JSON cloning

## Type Parameters

• **T** *extends* `object`

• **K** *extends* `string` \| `number` \| `symbol`

• **O** *extends* [`Json`](../type-aliases/Json.md) = [`Json`](../type-aliases/Json.md)

## Parameters

### value

`T`

JSOM compatible object

## Returns

`Record`\<`K`, `O`\>

Record<K, O>

## Defined in

[src/utils/utils.ts:280](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/utils/utils.ts#L280)
