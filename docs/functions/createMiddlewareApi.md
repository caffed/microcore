[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createMiddlewareApi

# Function: createMiddlewareApi()

> **createMiddlewareApi**\<`T`, `R`, `A`, `B`\>(`params`): (...`args`) => [`ApiRecord`](../interfaces/ApiRecord.md)\<`T`, `R`\>

Name: createMiddleware
Description: Main middleware API constructor
- Convenience factory for creating tranformable middleware APIs
- Provides sort and transform configurable modifier callbacks
- Caveat is that Middleware[] must be an array of objects containing 
  at least: [{ middleware }, ...]

## Type Parameters

• **T** = `any`

• **R** = `any`

• **A** *extends* [`TransformMiddleware`](../type-aliases/TransformMiddleware.md)\<`T`, `R`\> = [`TransformMiddleware`](../type-aliases/TransformMiddleware.md)\<`T`, `R`\>

• **B** *extends* [`TransformMiddleware`](../type-aliases/TransformMiddleware.md)\<`T`, `R`\> = `A`

## Parameters

### params

`CreateMiddlewareParams`\<`T`, `R`, `A`, `B`\> = `{}`

CreateMiddlewareParams<T, R, A, B>

## Returns

`Function`

(...args: T[]) => ApiRecord<T, R>

### Parameters

#### args

...`T`[]

### Returns

[`ApiRecord`](../interfaces/ApiRecord.md)\<`T`, `R`\>

## Defined in

[src/middleware/middleware.ts:186](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/middleware/middleware.ts#L186)
