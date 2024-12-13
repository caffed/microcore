[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createProxiedMatcher

# Function: createProxiedMatcher()

> **createProxiedMatcher**\<`A`, `B`\>(`params`): `ProxyHandler`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

Name: createProxiedMatcher
Description: The `createProxiedMatcher<A, B>` allows for a flexible micro-assertion library
 extendable via middleware. This throws for any failure.

## Type Parameters

• **A** = `any`

• **B** = `A`

## Parameters

### params

`ProxiedMatcherParams` & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md) = `{}`

Hander, Target, and middleware options

## Returns

`ProxyHandler`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

ProxyHandler<AnyObject>

## Defined in

[src/matcher/matcher.ts:144](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/matcher/matcher.ts#L144)
