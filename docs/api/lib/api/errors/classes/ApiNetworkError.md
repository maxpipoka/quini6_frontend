[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiNetworkError

# Class: ApiNetworkError

Defined in: [lib/api/errors.ts:77](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L77)

## Extends

- [`ApiError`](ApiError.md)

## Constructors

### Constructor

> **new ApiNetworkError**(`message`, `requestId`, `originalError`, `path`): `ApiNetworkError`

Defined in: [lib/api/errors.ts:80](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L80)

#### Parameters

##### message

`string`

##### requestId

`string`

##### originalError

`Error`

##### path

`string`

#### Returns

`ApiNetworkError`

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

***

### originalError

> `readonly` **originalError**: `Error`

Defined in: [lib/api/errors.ts:78](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L78)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [lib/api/errors.ts:86](https://github.com/maxpipoka/quini6_frontend/blob/803769e3ab929a99e160482efb642007cfa47821/src/lib/api/errors.ts#L86)

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

##### originalError

> **originalError**: `string`

#### Overrides

[`ApiError`](ApiError.md).[`toJSON`](ApiError.md#tojson)
