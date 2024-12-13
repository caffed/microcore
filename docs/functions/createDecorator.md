[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createDecorator

# Function: createDecorator()

> **createDecorator**\<`T`, `V`, `R`\>(`params`): (...`args`) => `R`

Name: createDecorator<T, V, R> 
Description: Generic decorator factory

## Type Parameters

• **T** *extends* [`ArrowFunction`](../type-aliases/ArrowFunction.md) \| [`ConstructorFunction`](../type-aliases/ConstructorFunction.md)

• **V** = `any`

• **R** *extends* [`DecoratorReturnType`](../type-aliases/DecoratorReturnType.md)\<`V`\> = [`DecoratorReturnType`](../type-aliases/DecoratorReturnType.md)\<`V`\>

## Parameters

### params

`CreateDecoratorParams`\<`T`, `V`\>

CreateDecoratorParams<T, V>

## Returns

`Function`

Decorator<T, V, R>

### Parameters

#### args

...[`T`, `string` \| `symbol`, `number` \| `PropertyDescriptor` \| `TypedPropertyDescriptor`\<`V`\>]

### Returns

`R`

## Defined in

[src/decorators/decorators.ts:119](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L119)
