[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiTimeoutError

# Class: ApiTimeoutError

Defined in: [lib/api/errors.ts:118](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L118)

## Extends

- [`ApiError`](ApiError.md)

## Constructors

### Constructor

> **new ApiTimeoutError**(`requestId`, `path`, `timeout`): `ApiTimeoutError`

Defined in: [lib/api/errors.ts:119](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L119)

#### Parameters

##### requestId

`string`

##### path

`string`

##### timeout

`number`

#### Returns

`ApiTimeoutError`

#### Overrides

[`ApiError`](ApiError.md).[`constructor`](ApiError.md#constructor)

## Properties

### requestId

> `readonly` **requestId**: `string`

Defined in: [lib/api/errors.ts:16](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L16)

#### Inherited from

[`ApiError`](ApiError.md).[`requestId`](ApiError.md#requestid)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: [lib/api/errors.ts:17](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L17)

#### Inherited from

[`ApiError`](ApiError.md).[`statusCode`](ApiError.md#statuscode)

***

### timestamp

> `readonly` **timestamp**: `string`

Defined in: [lib/api/errors.ts:18](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L18)

#### Inherited from

[`ApiError`](ApiError.md).[`timestamp`](ApiError.md#timestamp)

***

### path

> `readonly` **path**: `string`

Defined in: [lib/api/errors.ts:19](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L19)

#### Inherited from

[`ApiError`](ApiError.md).[`path`](ApiError.md#path)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [lib/api/errors.ts:41](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L41)

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

#### Inherited from

[`ApiError`](ApiError.md).[`toJSON`](ApiError.md#tojson)
