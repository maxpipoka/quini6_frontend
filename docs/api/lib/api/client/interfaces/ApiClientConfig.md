[**Quini6 Frontend v0.0.1**](../../../../README.md)

***

[Quini6 Frontend](../../../../modules.md) / [lib/api/client](../README.md) / ApiClientConfig

# Interface: ApiClientConfig

Defined in: [lib/api/client.ts:23](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L23)

## Properties

### baseUrl

> **baseUrl**: `string`

Defined in: [lib/api/client.ts:24](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L24)

***

### timeout?

> `optional` **timeout?**: `number`

Defined in: [lib/api/client.ts:25](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L25)

***

### defaultHeaders?

> `optional` **defaultHeaders?**: `Record`\<`string`, `string`\>

Defined in: [lib/api/client.ts:26](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L26)

***

### retryAttempts?

> `optional` **retryAttempts?**: `number`

Defined in: [lib/api/client.ts:27](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L27)

***

### retryDelay?

> `optional` **retryDelay?**: (`attempt`) => `number`

Defined in: [lib/api/client.ts:28](https://github.com/maxpipoka/quini6_frontend/blob/8c4672644da6592ce81e785866b473183e5202e0/src/lib/api/client.ts#L28)

#### Parameters

##### attempt

`number`

#### Returns

`number`
