[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / applyMiddleware

# Function: applyMiddleware()

> **applyMiddleware**\<`T`, `R`\>(...`middlewares`): [`AppliedMiddlewareFactory`](../type-aliases/AppliedMiddlewareFactory.md)\<`T`, `R`\>

Name: applyMiddleware
Description: Apply/A combinator. Apply combinator and main entry point for creating miuddleware

## Type Parameters

• **T** = `any`

• **R** = `any`

## Parameters

### middlewares

...[`Middleware`](../type-aliases/Middleware.md)\<`T`, `R`\>[]

Array of middleware

## Returns

[`AppliedMiddlewareFactory`](../type-aliases/AppliedMiddlewareFactory.md)\<`T`, `R`\>

AppliedMiddlewareFactory<T, R>

## Defined in

[src/middleware/middleware.ts:135](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/middleware/middleware.ts#L135)
