[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createProxy

# Function: createProxy()

> **createProxy**\<`T`\>(`handler`): (`target`) => `ProxyHandler`\<`T`\>

Name: createProxy
Description: Typed proxy constructor

## Type Parameters

• **T** *extends* [`AnyObject`](../interfaces/AnyObject.md)\<`any`\> = [`AnyObject`](../interfaces/AnyObject.md)\<`any`\>

## Parameters

### handler

`ProxyHandler`\<`T`\>

## Returns

`Function`

(target) => ProxyHandler

### Parameters

#### target

`T`

### Returns

`ProxyHandler`\<`T`\>

## Defined in

[src/utils/utils.ts:131](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/utils/utils.ts#L131)
