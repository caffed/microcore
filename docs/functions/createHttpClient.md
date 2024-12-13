[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / createHttpClient

# Function: createHttpClient()

> **createHttpClient**(`defaultParams`): `object`

Name: createHttpClient
Description: Per path/resource HttpClient factory
Function:

## Parameters

### defaultParams

[`HttpClientParams`](../type-aliases/HttpClientParams.md) & [`MiddlewareParams`](../type-aliases/MiddlewareParams.md)

HttpClientParams

## Returns

`object`

HTTP method factories based of default params

### connect()

> **connect**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### delete()

> **delete**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### get()

> **get**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### head()

> **head**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### options()

> **options**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### patch()

> **patch**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### post()

> **post**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### put()

> **put**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

### trace()

> **trace**: (`params`?) => `Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

#### Parameters

##### params?

[`HttpClientParams`](../type-aliases/HttpClientParams.md)

#### Returns

`Promise`\<(`requestInit`?) => `Promise`\<`any`\>\>

## Defined in

[src/httpclient/httpclient.ts:288](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/httpclient/httpclient.ts#L288)
