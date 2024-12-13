[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Decorator

# Type Alias: Decorator\<T, V, R\>

> **Decorator**\<`T`, `V`, `R`\>: [`Callable`](Callable.md)\<[`T`, `string` \| `symbol`, `number` \| `PropertyDescriptor` \| `TypedPropertyDescriptor`\<`V`\>], `R`\>

Name: Decorator<T, V, R>
Description: Superset Decorator type

## Type Parameters

• **T** *extends* [`Callable`](Callable.md) \| [`Constructable`](Constructable.md)

• **V** = `any`

• **R** *extends* [`DecoratorReturnType`](DecoratorReturnType.md)\<`V`\> = [`DecoratorReturnType`](DecoratorReturnType.md)\<`V`\>

## Template

V, R - T: target type, V: TypedPropertyDescriptor value, R: return type

## Defined in

[src/decorators/decorators.ts:34](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L34)
