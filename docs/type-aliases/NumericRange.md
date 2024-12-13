[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / NumericRange

# Type Alias: NumericRange\<start, end, arr, acc\>

> **NumericRange**\<`start`, `end`, `arr`, `acc`\>: `arr`\[`"length"`\] *extends* `end` ? `acc` \| `start` \| `end` : [`NumericRange`](NumericRange.md)\<`start`, `end`, [`...arr`, `1`], `arr`\[`start`\] *extends* `undefined` ? `acc` : `acc` \| `arr`\[`"length"`\]\>

## Type Parameters

• **start** *extends* `number`

• **end** *extends* `number`

• **arr** *extends* `unknown`[] = []

• **acc** *extends* `number` = `never`

## Defined in

[src/types.ts:162](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/types.ts#L162)
