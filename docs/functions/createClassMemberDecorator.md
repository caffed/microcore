[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createClassMemberDecorator

# Function: createClassMemberDecorator()

> **createClassMemberDecorator**\<`T`, `V`, `R`\>(`params`): `any`

Name: createClassMemberDecorator<T, V, R>
Description: Class Member (inner level) decorator factory

## Type Parameters

• **T** *extends* [`ConstructorFunction`](../type-aliases/ConstructorFunction.md) = [`ConstructorFunction`](../type-aliases/ConstructorFunction.md)

• **V** = `any`

• **R** *extends* [`DecoratorReturnType`](../type-aliases/DecoratorReturnType.md)\<() => `void`\> = `void` \| `PropertyDescriptor` \| `TypedPropertyDescriptor`\<() => `void`\>

## Parameters

### params

`CreateDecoratorParams`\<`T`, `V`\>

CreateDecoratorParams<T, V>

## Returns

`any`

Decorator<T, V, R>

## Defined in

[src/decorators/decorators.ts:204](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L204)
