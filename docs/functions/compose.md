[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / compose

# Function: compose()

> **compose**\<`M`\>(...`middlewares`): [`ArrowFunction`](../type-aliases/ArrowFunction.md)

Name: compose
Description: B/compose combinator. Compose combinator speciffically designed
 to handle Middleware (not general purpose).

## Type Parameters

• **M** *extends* [`Middleware`](../type-aliases/Middleware.md)\<`any`, `any`\>

Middleware type

## Parameters

### middlewares

...`M`[]

## Returns

[`ArrowFunction`](../type-aliases/ArrowFunction.md)

ArrowFunction of chained middleware

## Defined in

[src/middleware/middleware.ts:105](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/middleware/middleware.ts#L105)
