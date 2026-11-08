[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiHttpError

# Class: ApiHttpError

Defined in: [lib/api/errors.ts:94](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L94)

## Extends

- [`ApiError`](ApiError.md)

## Constructors

### Constructor

> **new ApiHttpError**(`message`, `requestId`, `statusCode`, `timestamp`, `path`, `responseBody?`): `ApiHttpError`

Defined in: [lib/api/errors.ts:97](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L97)

#### Parameters

##### message

`string`

##### requestId

`string`

##### statusCode

`number`

##### timestamp

`string`

##### path

`string`

##### responseBody?

`unknown` = `null`

#### Returns

`ApiHttpError`

#### Overrides

[`ApiError`](ApiError.md).[`constructor`](ApiError.md#constructor)

## Properties

### requestId

> `readonly` **requestId**: `string`

Defined in: [lib/api/errors.ts:16](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L16)

#### Inherited from

[`ApiError`](ApiError.md).[`requestId`](ApiError.md#requestid)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: [lib/api/errors.ts:17](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L17)

#### Inherited from

[`ApiError`](ApiError.md).[`statusCode`](ApiError.md#statuscode)

***

### timestamp

> `readonly` **timestamp**: `string`

Defined in: [lib/api/errors.ts:18](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L18)

#### Inherited from

[`ApiError`](ApiError.md).[`timestamp`](ApiError.md#timestamp)

***

### path

> `readonly` **path**: `string`

Defined in: [lib/api/errors.ts:19](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L19)

#### Inherited from

[`ApiError`](ApiError.md).[`path`](ApiError.md#path)

***

### responseBody

> `readonly` **responseBody**: `unknown`

Defined in: [lib/api/errors.ts:95](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L95)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [lib/api/errors.ts:110](https://github.com/maxpipoka/quini6_frontend/blob/9f722dfc2bfe14741847adbac029e48d9370d9af/src/lib/api/errors.ts#L110)

#### Returns

`object`

##### name

> **name**: `string`

##### message

> **message**: `string`

##### requestId

> **requestId**: `string`

##### statusCode

> **statusCode**: `number`

##### timestamp

> **timestamp**: `string`

##### path

> **path**: `string`

##### responseBody

> **responseBody**: `unknown`

#### Overrides

[`ApiError`](ApiError.md).[`toJSON`](ApiError.md#tojson)
