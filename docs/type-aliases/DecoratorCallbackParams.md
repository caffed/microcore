[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / DecoratorCallbackParams

# Type Alias: DecoratorCallbackParams\<T, V\>

> **DecoratorCallbackParams**\<`T`, `V`\>: `object`

Name: DecoratorCallbackParams<T, V>
Description: Superset Decorator type

## Type Parameters

• **T**

• **V**

## Type declaration

### api?

> `optional` **api**: [`Callable`](Callable.md)\<`any`[], [`ApiRecord`](../interfaces/ApiRecord.md)\>

### descriptor?

> `optional` **descriptor**: `PropertyDescriptor` \| `TypedPropertyDescriptor`\<`V`\>

### parameterIndex?

> `optional` **parameterIndex**: `number`

### propertyKey?

> `optional` **propertyKey**: `string` \| `symbol`

### target

> **target**: `T`

## Template

V - T: target type, V: TypedPropertyDescriptor value

## Defined in

[src/decorators/decorators.ts:72](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L72)
