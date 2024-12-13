[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createClassParameterHandler

# Function: createClassParameterHandler()

> **createClassParameterHandler**(`callback`): (`target`, `propertyKey`, `parameterIndex`) => `void`

Class Method Parameter Handler
https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators

Name: createClassParameterHandler
Description: Class parameter (inner level) decorator handler

## Parameters

### callback

(...`args`) => `void`

## Returns

`Function`

Class parameter decorator (target, propertyKey, parameterIndex) => void

### Parameters

#### target

[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>

#### propertyKey

`string` | `symbol`

#### parameterIndex

`number`

### Returns

`void`

## Defined in

[src/decorators/decorators.ts:285](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L285)
