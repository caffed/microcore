[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / LineOptions

# Type Alias: LineOptions\<F\>

> **LineOptions**\<`F`\>: `object`

Name: LineOptions
Description: Line options used for logging lines through the API
 The `formatter` is used to create, most likely, a string.
 The `level` sets the severity
 The `prefix` identifies what is logging 
 The `timeStamp` represents the timestamp of the loglne

## Type Parameters

• **F** = `string`

F: log line format

## Type declaration

### formatter

> **formatter**: [`Callable`](Callable.md)\<`any`[], `F`\>

### level

> **level**: [`LogLevel`](LogLevel.md)

### prefix

> **prefix**: `string`

### timeStamp

> **timeStamp**: `object`

#### timeStamp.formatted

> **formatted**: `string`

#### timeStamp.raw

> **raw**: `Date`

## Defined in

[src/logger/logger.ts:67](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/logger/logger.ts#L67)
