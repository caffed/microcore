[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / RequestInit

# Type Alias: RequestInit

> **RequestInit**: `object`

https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
Name: RequestInit
Description: Request used for overload of `fetch(string | URL, RequestInit)` vs. `fetch(Request)`

## Type declaration

### attributionReporting?

> `optional` **attributionReporting**: [`AttributionReportingOptions`](AttributionReportingOptions.md)

### body?

> `optional` **body**: [`RequestBody`](RequestBody.md)

### browsingTopics?

> `optional` **browsingTopics**: `boolean`

### cache?

> `optional` **cache**: `RequestCache`

### credentials?

> `optional` **credentials**: `RequestCredentials`

### headers?

> `optional` **headers**: `Headers`

### integrity?

> `optional` **integrity**: `string`

While integrity is not officially listed as optional,
it has a default value of an empty string so it is technically optional.

### keepalive?

> `optional` **keepalive**: `boolean`

### method?

> `optional` **method**: [`HTTPMethodValues`](HTTPMethodValues.md)

### mode?

> `optional` **mode**: `RequestMode`

### priority?

> `optional` **priority**: [`RequestPriority`](RequestPriority.md)

### redirect?

> `optional` **redirect**: `RequestRedirect`

### referrer?

> `optional` **referrer**: `""` \| `"about:client"` \| `URL`\[`"href"`\]

### referrerPolicy?

> `optional` **referrerPolicy**: `ReferrerPolicy`

### signal?

> `optional` **signal**: `AbortSignal` \| `null`

## Defined in

[src/httpclient/httpclient.ts:107](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/httpclient/httpclient.ts#L107)
