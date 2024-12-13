[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createMatcherProxyHandler

# Function: createMatcherProxyHandler()

> **createMatcherProxyHandler**\<`H`, `P`, `R`\>(`defaultHandler`, `options`): `ProxyHandler`\<`H`\>

Description: Proxied matcher
- Used for writing validations that have more natural language validators
- Inspired by ChaiJS
- Can be used for assertion or input validators etc
- ex: 
  const validator = createProxiedMatcher(options);
  validator.match(actual.a, actual.b)
  validator.expect(actual).to.customEvaluator()

## Type Parameters

• **H** *extends* [`AnyObject`](../interfaces/AnyObject.md)\<`any`\> = [`AnyObject`](../interfaces/AnyObject.md)\<`any`\>

• **P** *extends* `string` \| `symbol` = `string` \| `symbol`

• **R** = `any`

## Parameters

### defaultHandler

[`AnyObject`](../interfaces/AnyObject.md)\<`any`\> = `{}`

### options

[`AnyObject`](../interfaces/AnyObject.md)\<`any`\> = `{}`

## Returns

`ProxyHandler`\<`H`\>

## Defined in

[src/matcher/matcher.ts:97](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/matcher/matcher.ts#L97)
