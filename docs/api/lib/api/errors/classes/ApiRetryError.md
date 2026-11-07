[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/errors](../README.md) / ApiRetryError

# Class: ApiRetryError

Defined in: [lib/api/errors.ts:125](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L125)

## Extends

- [`ApiError`](ApiError.md)

## Constructors

### Constructor

> **new ApiRetryError**(`message`, `requestId`, `statusCode`, `timestamp`, `path`, `attempts`, `lastError`): `ApiRetryError`

Defined in: [lib/api/errors.ts:129](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L129)

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

##### attempts

`number`

##### lastError

`Error`

#### Returns

`ApiRetryError`

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

### attempts

> `readonly` **attempts**: `number`

Defined in: [lib/api/errors.ts:126](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L126)

***

### lastError

> `readonly` **lastError**: `Error`

Defined in: [lib/api/errors.ts:127](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L127)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [lib/api/errors.ts:144](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/errors.ts#L144)

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

##### attempts

> **attempts**: `number`

##### lastError

> **lastError**: `string`

#### Overrides

[`ApiError`](ApiError.md).[`toJSON`](ApiError.md#tojson)
