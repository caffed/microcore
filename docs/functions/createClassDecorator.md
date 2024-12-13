[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createClassDecorator

# Function: createClassDecorator()

> **createClassDecorator**\<`T`, `V`, `R`\>(`params`): (...`args`) => `R`

Name: createClassDecorator<T, V, R> 
Description: Class (top level constructor) decorator factory

## Type Parameters

• **T** *extends* [`ConstructorFunction`](../type-aliases/ConstructorFunction.md) = [`ConstructorFunction`](../type-aliases/ConstructorFunction.md)

• **V** = `any`

• **R** *extends* [`DecoratorReturnType`](../type-aliases/DecoratorReturnType.md)\<`V`\> = `void` \| `FunctionConstructor`

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

[src/decorators/decorators.ts:187](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L187)
