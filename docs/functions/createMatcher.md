[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createMatcher

# Function: createMatcher()

> **createMatcher**\<`A`, `B`\>(`params`): (...`args`) => `boolean`

Name: CreateMatchParams
Description: options to pass to matcher middleware

## Type Parameters

• **A** = `any`

• **B** = `A`

## Parameters

### params

`CreateMatchParams` & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md) = `{}`

Middleware options for matcher

## Returns

`Function`

Callable<[A, B], boolean>

### Parameters

#### args

...[`A`, `B`]

### Returns

`boolean`

## Defined in

[src/matcher/matcher.ts:49](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/matcher/matcher.ts#L49)
