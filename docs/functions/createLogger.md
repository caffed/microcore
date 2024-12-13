[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createLogger

# Function: createLogger()

> **createLogger**\<`F`\>(`params`): [`Logger`](../type-aliases/Logger.md)\<`F`\>

Name: createLogger<F>
Description: Creates a middleware enabled Logger

## Type Parameters

• **F** = `string`

F: log line format

## Parameters

### params

`LoggerParams`\<`F`\> & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md) = `{}`

LoggerParams<F> & MiddlewareParams

## Returns

[`Logger`](../type-aliases/Logger.md)\<`F`\>

Logger<F>

## Defined in

[src/logger/logger.ts:155](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/logger/logger.ts#L155)
