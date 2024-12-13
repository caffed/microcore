[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / MiddlewareParams

# Type Alias: MiddlewareParams\<T, R, A, B\>

> **MiddlewareParams**\<`T`, `R`, `A`, `B`\>: `object`

## Type Parameters

• **T** = `any`

• **R** = `any`

• **A** = `any`

• **B** = `A`

## Type declaration

### createApi?

> `optional` **createApi**: [`ApiFactory`](ApiFactory.md)\<`T`, `R`\>

### middleware?

> `optional` **middleware**: [`TransformMiddleware`](TransformMiddleware.md)\<`T`, `R`\>[]

### sort?

> `optional` **sort**: [`CompareFunction`](CompareFunction.md)\<`A`, `B`\>

### transform?

> `optional` **transform**: [`Callable`](Callable.md)\<`any`[], `any`\>

## Defined in

[src/middleware/middleware.ts:84](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/middleware/middleware.ts#L84)
