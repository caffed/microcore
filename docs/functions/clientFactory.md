[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / clientFactory

# Function: clientFactory()

> **clientFactory**(`method`, `defaultParams`): (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

Name: clientFactory
Description: Per method HttpClient factory
Function:

## Parameters

### method

[`HTTPMethods`](../enumerations/HTTPMethods.md)

HTTPMethods

### defaultParams

[`HttpClientParams`](../type-aliases/HttpClientParams.md) & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md)

HttpClientParams

## Returns

`Function`

### Parameters

#### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

## Defined in

[src/httpclient/httpclient.ts:264](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/httpclient/httpclient.ts#L264)
