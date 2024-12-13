[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / HttpClient

# Function: HttpClient()

> **HttpClient**\<`R`\>(`defaultParams`): (`requestInit`?) => `Promise`\<`R`\>

Name: HttpClient
Description: fetch request factory with request and response middleware support
Function:

## Type Parameters

• **R** = `any`

## Parameters

### defaultParams

[`HttpClientParams`](../type-aliases/HttpClientParams.md) & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md)

HttpClientParams

## Returns

`Function`

async http client

### Parameters

#### requestInit?

[`RequestInit`](../type-aliases/RequestInit.md)

### Returns

`Promise`\<`R`\>

## Defined in

[src/httpclient/httpclient.ts:186](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/httpclient/httpclient.ts#L186)
