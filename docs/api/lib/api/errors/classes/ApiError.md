[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiError

# Abstract Class: ApiError

Defined in: [lib/api/errors.ts:15](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L15)

## Extends

- `Error`

## Extended by

- [`ApiValidationError`](ApiValidationError.md)
- [`ApiNetworkError`](ApiNetworkError.md)
- [`ApiHttpError`](ApiHttpError.md)
- [`ApiTimeoutError`](ApiTimeoutError.md)
- [`ApiRetryError`](ApiRetryError.md)

## Constructors

### Constructor

> **new ApiError**(`message`, `requestId`, `statusCode`, `timestamp`, `path`): `ApiError`

Defined in: [lib/api/errors.ts:21](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L21)

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

#### Returns

`ApiError`

#### Overrides

`Error.constructor`

## Properties

### requestId

> `readonly` **requestId**: `string`

Defined in: [lib/api/errors.ts:16](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L16)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: [lib/api/errors.ts:17](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L17)

***

### timestamp

> `readonly` **timestamp**: `string`

Defined in: [lib/api/errors.ts:18](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L18)

***

### path

> `readonly` **path**: `string`

Defined in: [lib/api/errors.ts:19](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L19)

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
