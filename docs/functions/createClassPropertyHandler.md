[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createClassPropertyHandler

# Function: createClassPropertyHandler()

> **createClassPropertyHandler**(`params`): (`target`, `propertyKey`) => `void`

Class Accessor/Property Handler
- Property get and set can be changed.
- See: https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
- NOTE: For property decorators to work, you must either use the 'declare' keyword or 
        'useDefineForClassFields' must be set to false in tsconfig.json.
        https://github.com/microsoft/TypeScript/issues/35081

        Example:
 
        `class Test {
          @Decorator
          declare prop: string;
        }`

Name: createClassPropertyHandler
Description: Class Member (inner level) decorator handler

## Parameters

### params

calllback: callback for handler, accessors: accessor override

#### accessors

\{`get`: () => `any`;`set`: () => `void` \| (...`args`) => `void` \| (`arg`) => `void` \| (`arg`?) => `void`; \}

#### accessors.get

() => `any`

#### accessors.set

() => `void` \| (...`args`) => `void` \| (`arg`) => `void` \| (`arg`?) => `void`

#### callback

(...`args`) => `void`

## Returns

`Function`

Class member decorator (target, propertyKey) => void

### Parameters

#### target

`any`

#### propertyKey

`string` | `symbol`

### Returns

`void`

## Defined in

[src/decorators/decorators.ts:320](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/decorators/decorators.ts#L320)
