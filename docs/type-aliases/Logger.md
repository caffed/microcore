[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / Logger

# Type Alias: Logger\<F\>

> **Logger**\<`F`\>: `object`

Description: Logger API type definition

## Type Parameters

• **F** = `string`

F: log line format

## Type declaration

### log()

> **log**: (...`args`) => `void`

#### Parameters

##### args

...`any`[]

#### Returns

`void`

### updateOptions()

> **updateOptions**: (`params`) => `void`

#### Parameters

##### params

`LoggerParams`\<`F`\>

#### Returns

`void`

## Defined in

[src/logger/logger.ts:85](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/logger/logger.ts#L85)
