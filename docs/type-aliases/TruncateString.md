[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / TruncateString

# Type Alias: TruncateString\<T, N, L, S\>

> **TruncateString**\<`T`, `N`, `L`, `S`\>: `N` *extends* `L`\[`"length"`\] ? `S` : `T` *extends* \`$\{infer F\}$\{infer R\}\` ? [`TruncateString`](TruncateString.md)\<`R`, `N`, [`0`, `...L`], \`$\{S\}$\{F\}\`\> : `S`

Rewrtitten from

## Type Parameters

• **T** *extends* `string`

• **N** *extends* `number`

• **L** *extends* `any`[] = []

• **S** *extends* `string` = `""`

## Defined in

[src/types.ts:175](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L175)
