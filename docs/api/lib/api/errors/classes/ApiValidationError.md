[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiValidationError

# Class: ApiValidationError

Defined in: [lib/api/errors.ts:53](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L53)

## Extends

- [`ApiError`](ApiError.md)

## Constructors

### Constructor

> **new ApiValidationError**(`message`, `requestId`, `statusCode`, `timestamp`, `path`, `errors?`): `ApiValidationError`

Defined in: [lib/api/errors.ts:56](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L56)

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

##### errors?

`string`[] = `[]`

#### Returns

`ApiValidationError`

#### Overrides

[`ApiError`](ApiError.md).[`constructor`](ApiError.md#constructor)

## Properties

### requestId

> `readonly` **requestId**: `string`

Defined in: [lib/api/errors.ts:16](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L16)

#### Inherited from

[`ApiError`](ApiError.md).[`requestId`](ApiError.md#requestid)

***

### statusCode

> `readonly` **statusCode**: `number`

Defined in: [lib/api/errors.ts:17](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L17)

#### Inherited from

[`ApiError`](ApiError.md).[`statusCode`](ApiError.md#statuscode)

***

### timestamp

> `readonly` **timestamp**: `string`

Defined in: [lib/api/errors.ts:18](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L18)

#### Inherited from

[`ApiError`](ApiError.md).[`timestamp`](ApiError.md#timestamp)

***

### path

> `readonly` **path**: `string`

Defined in: [lib/api/errors.ts:19](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L19)

#### Inherited from

[`ApiError`](ApiError.md).[`path`](ApiError.md#path)

***

### errors

> `readonly` **errors**: `string`[]

Defined in: [lib/api/errors.ts:54](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L54)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [lib/api/errors.ts:69](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L69)

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

##### errors

> **errors**: `string`[]

#### Overrides

[`ApiError`](ApiError.md).[`toJSON`](ApiError.md#tojson)
