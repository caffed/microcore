[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createClassMethodHandler

# Function: createClassMethodHandler()

> **createClassMethodHandler**\<`V`\>(`params`): (`target`, `propertyKey`, `descriptor`) => `void`

Class Method Handler
- Only descriptors can be updated.
- See: https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators

Name: createClassMethodHandler
Description: Class method (inner level) decorator handler

## Type Parameters

• **V** = `any`

## Parameters

### params

calllback: callback for handler, newDescriptor: descriptor override

#### callback

(...`args`) => `void`

#### newDescriptor

`PropertyDescriptor` \| `TypedPropertyDescriptor`\<`V`\>

## Returns

`Function`

Class method decorator (target, propertyKey, descriptor) => void

### Parameters

#### target

`any`

#### propertyKey

`string` | `symbol`

#### descriptor

`PropertyDescriptor` | `TypedPropertyDescriptor`\<`V`\>

### Returns

`void`

## Defined in

[src/decorators/decorators.ts:247](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L247)
