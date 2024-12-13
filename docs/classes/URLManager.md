[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / URLManager

# Class: URLManager

Name: URLManager
Classdesc: URL class with additional static and instance methods for managing multiple generated URLs

Implements: URL

## Extends

- `URL`

## Constructors

### new URLManager()

> **new URLManager**(`url`): [`URLManager`](URLManager.md)

#### Parameters

##### url

`string`

#### Returns

[`URLManager`](URLManager.md)

#### Overrides

`URL.constructor`

#### Defined in

[src/urlmanager/urlmanager.ts:104](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L104)

## Properties

### hash

> **hash**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/hash)

#### Inherited from

`URL.hash`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23221

***

### host

> **host**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/host)

#### Inherited from

`URL.host`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23223

***

### hostname

> **hostname**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/hostname)

#### Inherited from

`URL.hostname`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23225

***

### href

> **href**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/href)

#### Inherited from

`URL.href`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23227

***

### origin

> `readonly` **origin**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/origin)

#### Inherited from

`URL.origin`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23230

***

### password

> **password**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/password)

#### Inherited from

`URL.password`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23232

***

### pathname

> **pathname**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/pathname)

#### Inherited from

`URL.pathname`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23234

***

### port

> **port**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/port)

#### Inherited from

`URL.port`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23236

***

### protocol

> **protocol**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/protocol)

#### Inherited from

`URL.protocol`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23238

***

### search

> **search**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/search)

#### Inherited from

`URL.search`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23240

***

### searchParams

> `readonly` **searchParams**: `URLSearchParams`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/searchParams)

#### Inherited from

`URL.searchParams`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23242

***

### username

> **username**: `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/username)

#### Inherited from

`URL.username`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23244

## Accessors

### params

#### Get Signature

> **get** **params**(): `Readonly`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

Name: params
Description: Returns searchParams as Object instead of iterable
  - Arrays are repeated keys: `?key=val&key=val2` === { key: ['val', 'val2' ] }
  - Objects use dot notation: `?obj.key=val&obj.key=val2&obj.key2=val3` === { obj: { key: ['val', 'val2'], key2: 'val3' } }

##### Returns

`Readonly`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

Readonly<AnyObject>

#### Set Signature

> **set** **params**(`data`): `void`

Name: params
Description:

##### Parameters

###### data

[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>

Anyobject of params to set

##### Returns

`void`

#### Defined in

[src/urlmanager/urlmanager.ts:116](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L116)

***

### currentUrl

#### Get Signature

> **get** `static` **currentUrl**(): `URL`

Name: currentUrl
Description: URLManager instance of current url

##### Static

##### Returns

`URL`

URLManager

#### Defined in

[src/urlmanager/urlmanager.ts:59](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L59)

***

### objectURLS

#### Get Signature

> **get** `static` **objectURLS**(): readonly `string`[]

Name: objectURLS
Description: string[] of objectUrls

##### Static

##### Returns

readonly `string`[]

string[]

#### Defined in

[src/urlmanager/urlmanager.ts:70](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L70)

## Methods

### toJSON()

> **toJSON**(): `string`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/toJSON)

#### Returns

`string`

#### Inherited from

`URL.toJSON`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23246

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Inherited from

`URL.toString`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23228

***

### canParse()

> `static` **canParse**(`url`, `base`?): `boolean`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/canParse_static)

#### Parameters

##### url

`string` | `URL`

##### base?

`string` | `URL`

#### Returns

`boolean`

#### Inherited from

`URL.canParse`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23253

***

### createObjectURL()

> `static` **createObjectURL**(`obj`): `string`

Override
https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static

#### Parameters

##### obj

`Blob` | `File` | `MediaSource`

#### Returns

`string`

string

#### Static

#### Overrides

`URL.createObjectURL`

#### Defined in

[src/urlmanager/urlmanager.ts:46](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L46)

***

### parse()

> `static` **parse**(`url`, `base`?): `URL`

[MDN Reference](https://developer.mozilla.org/docs/Web/API/URL/parse_static)

#### Parameters

##### url

`string` | `URL`

##### base?

`string` | `URL`

#### Returns

`URL`

#### Inherited from

`URL.parse`

#### Defined in

node\_modules/typescript/lib/lib.dom.d.ts:23257

***

### revokeAllObjectURLs()

> `static` **revokeAllObjectURLs**(): `void`

Name: revokeAllObjectURLs
Description: revokes all known object urls

#### Returns

`void`

#### Static

#### Defined in

[src/urlmanager/urlmanager.ts:95](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L95)

***

### revokeObjectURL()

> `static` **revokeObjectURL**(`url`): `void`

Name: revokeObjectURL
Description: Override
- https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL_static

#### Parameters

##### url

`string`

#### Returns

`void`

#### Static

#### Overrides

`URL.revokeObjectURL`

#### Defined in

[src/urlmanager/urlmanager.ts:82](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/urlmanager/urlmanager.ts#L82)
