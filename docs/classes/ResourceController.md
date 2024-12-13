[**@caffedpkg/microcore**](../README.md)

***

[@caffedpkg/microcore](../globals.md) / ResourceController

# Class: ResourceController

Name: ResourceController class
Description: Class for managing multiple Resource instances
  Static methods are for global management
  Instances are for managing "domains" or different contexts
  const rc = new ResourceController(options);
  ResourceController.createResource(options): Resource
  rc.createImage(options)

## Constructors

### new ResourceController()

> **new ResourceController**(`name`): [`ResourceController`](ResourceController.md)

#### Parameters

##### name

`string` | `symbol`

#### Returns

[`ResourceController`](ResourceController.md)

#### Defined in

[src/resource/resource.ts:136](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L136)

## Accessors

### name

#### Get Signature

> **get** **name**(): `string`

Name: name
Description: lists name

##### Returns

`string`

Readonly<string>

#### Defined in

[src/resource/resource.ts:153](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L153)

***

### resources

#### Get Signature

> **get** **resources**(): `Readonly`\<`Record`\<`string`, [`Resource`](../type-aliases/Resource.md)\<`any`\>\>\>

Name: resources
Description: lists resources

##### Returns

`Readonly`\<`Record`\<`string`, [`Resource`](../type-aliases/Resource.md)\<`any`\>\>\>

Readonly<Record<string, Resource>>

#### Defined in

[src/resource/resource.ts:163](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L163)

## Methods

### create()

> **create**\<`T`\>(`params`): `void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`T`\>\>

Name: create
Description: create resource

#### Type Parameters

• **T** = `any`

#### Parameters

##### params

[`CreateResourceParams`](../interfaces/CreateResourceParams.md)\<`T`\>

CreateResourceParams<T>

#### Returns

`void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`T`\>\>

void | Readonly<Resource<T>>

#### Defined in

[src/resource/resource.ts:178](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L178)

***

### delete()

> **delete**(`name`): `boolean`

Name: delete
Description: delete resource by name

#### Parameters

##### name

`string` | `symbol`

#### Returns

`boolean`

boolean

#### Defined in

[src/resource/resource.ts:219](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L219)

***

### get()

> **get**(`name`): `void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`any`\>\>

Name: get
Description: gets resource by name

#### Parameters

##### name

`string` | `symbol`

#### Returns

`void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`any`\>\>

void | Readonly<Resource<T>>

#### Defined in

[src/resource/resource.ts:241](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L241)

***

### update()

> **update**\<`T`\>(`params`): `void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`T`\>\>

Name: update
Description: updates resource by name

#### Type Parameters

• **T** = `any`

#### Parameters

##### params

`Partial`\<[`CreateResourceParams`](../interfaces/CreateResourceParams.md)\<`T`\>\>

CreateResourceParams<T>

#### Returns

`void` \| `Readonly`\<[`Resource`](../type-aliases/Resource.md)\<`T`\>\>

void | Readonly<Resource<T>>

#### Defined in

[src/resource/resource.ts:252](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L252)

***

### list()

> `static` **list**(): `Readonly`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

#### Returns

`Readonly`\<[`AnyObject`](../interfaces/AnyObject.md)\<`any`\>\>

#### Defined in

[src/resource/resource.ts:113](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L113)

***

### validateIdString()

> `static` **validateIdString**(`str`): `boolean`

Ensures strings do not contain a colon `:` in them.

#### Parameters

##### str

`string`

#### Returns

`boolean`

#### Defined in

[src/resource/resource.ts:128](https://github.com/caffed/microcore/blob/3444f5042af4893783a848f270124aa74f8db032/src/resource/resource.ts#L128)
